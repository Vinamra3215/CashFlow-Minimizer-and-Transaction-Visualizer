#include <emscripten.h>
#include <string>
#include <vector>
#include <queue>
#include <algorithm>
#include <cmath>
#include <sstream>
#include <iomanip>
#include <cstring>
#include <cstdlib>

// =====================================================
// CashFlow Minimizer - C++ DSA Algorithms
// Compiled to WebAssembly via Emscripten
// =====================================================

static const double EPSILON = 0.01;

// --- Data Structures ---

struct Balance {
    std::string person;
    double amount;
};

struct Transaction {
    std::string from;
    std::string to;
    double amount;
};

// Step for animation visualization
struct Step {
    std::string type;     // "info", "consider", "select", "transaction"
    std::string message;
    std::string from, to;
    double amount;
    std::string creditor, debtor;
    std::vector<std::string> people;

    Step() : amount(0) {}
};

struct AlgorithmResult {
    std::vector<Transaction> transactions;
    std::vector<Step> steps;
};

// --- Heap entry for std::priority_queue (real heap DSA) ---
struct HeapEntry {
    double amount;
    std::string person;
    bool operator<(const HeapEntry& other) const {
        return amount < other.amount; // max-heap
    }
};

// --- JSON Helpers ---

static std::string escJson(const std::string& s) {
    std::string r;
    for (char c : s) {
        if (c == '"') r += "\\\"";
        else if (c == '\\') r += "\\\\";
        else r += c;
    }
    return r;
}

static std::string fmtInt(double v) {
    std::ostringstream s; s << std::fixed << std::setprecision(0) << v; return s.str();
}

static std::string fmtDec(double v) {
    std::ostringstream s; s << std::fixed << std::setprecision(2) << v; return s.str();
}

// Parse simple JSON object {"key": number, ...}
static std::vector<Balance> parseInput(const std::string& json) {
    std::vector<Balance> result;
    size_t i = 0;
    while (i < json.size() && json[i] != '{') i++;
    i++;

    while (i < json.size()) {
        while (i < json.size() && (json[i] == ' ' || json[i] == ',' || json[i] == '\n' || json[i] == '\r' || json[i] == '\t')) i++;
        if (i >= json.size() || json[i] == '}') break;

        // Parse key
        if (json[i] != '"') break;
        i++;
        std::string key;
        while (i < json.size() && json[i] != '"') {
            if (json[i] == '\\' && i + 1 < json.size()) { key += json[i+1]; i += 2; }
            else { key += json[i]; i++; }
        }
        i++; // closing "

        while (i < json.size() && (json[i] == ':' || json[i] == ' ')) i++;

        // Parse number
        std::string num;
        while (i < json.size() && (json[i] == '-' || json[i] == '.' || json[i] == '+' ||
               (json[i] >= '0' && json[i] <= '9') || json[i] == 'e' || json[i] == 'E')) {
            num += json[i]; i++;
        }

        result.push_back({key, std::stod(num)});
    }
    return result;
}

// Serialize result to JSON string
static std::string serialize(const AlgorithmResult& res) {
    std::ostringstream ss;
    ss << "{\"transactions\":[";
    for (size_t i = 0; i < res.transactions.size(); i++) {
        if (i) ss << ",";
        ss << "{\"from\":\"" << escJson(res.transactions[i].from)
           << "\",\"to\":\"" << escJson(res.transactions[i].to)
           << "\",\"amount\":" << fmtDec(res.transactions[i].amount) << "}";
    }
    ss << "],\"steps\":[";
    for (size_t i = 0; i < res.steps.size(); i++) {
        if (i) ss << ",";
        const auto& st = res.steps[i];
        ss << "{\"type\":\"" << escJson(st.type) << "\"";
        if (!st.message.empty())
            ss << ",\"message\":\"" << escJson(st.message) << "\"";
        if (st.type == "transaction")
            ss << ",\"from\":\"" << escJson(st.from) << "\",\"to\":\"" << escJson(st.to)
               << "\",\"amount\":" << fmtDec(st.amount);
        if (st.type == "select")
            ss << ",\"creditor\":\"" << escJson(st.creditor)
               << "\",\"debtor\":\"" << escJson(st.debtor) << "\"";
        if (st.type == "consider" && !st.people.empty()) {
            ss << ",\"people\":[";
            for (size_t j = 0; j < st.people.size(); j++) {
                if (j) ss << ",";
                ss << "\"" << escJson(st.people[j]) << "\"";
            }
            ss << "]";
        }
        ss << "}";
    }
    ss << "]}";
    return ss.str();
}

// Helper: make info step
static Step infoStep(const std::string& msg) {
    Step s; s.type = "info"; s.message = msg; return s;
}

// Helper: make consider step
static Step considerStep(const std::vector<std::string>& people) {
    Step s; s.type = "consider"; s.people = people; return s;
}

// Helper: make select step
static Step selectStep(const std::string& creditor, const std::string& debtor, const std::string& msg) {
    Step s; s.type = "select"; s.creditor = creditor; s.debtor = debtor; s.message = msg; return s;
}

// Helper: make transaction step
static Step txnStep(const std::string& from, const std::string& to, double amt, const std::string& msg) {
    Step s; s.type = "transaction"; s.from = from; s.to = to; s.amount = amt; s.message = msg; return s;
}

// Helper: get non-zero balances
static std::vector<Balance> getActive(const std::vector<Balance>& balances) {
    std::vector<Balance> active;
    for (const auto& b : balances)
        if (std::abs(b.amount) > EPSILON) active.push_back(b);
    return active;
}

static std::vector<std::string> getNames(const std::vector<Balance>& v) {
    std::vector<std::string> names;
    for (const auto& b : v) names.push_back(b.person);
    return names;
}

// =====================================================
// ALGORITHM 1: GREEDY - O(N²) linear scan approach
// Uses: std::vector with linear search (no sorting)
// =====================================================

static AlgorithmResult greedyAlgorithm(std::vector<Balance> balances) {
    AlgorithmResult res;
    auto active = getActive(balances);

    res.steps.push_back(infoStep("Starting greedy algorithm - optimized O(N^2) with simple linear scans"));
    res.steps.push_back(considerStep(getNames(active)));

    while (true) {
        int maxCreditIdx = -1, maxDebitIdx = -1;
        double maxCredit = 0, maxDebit = 0;

        for (int i = 0; i < (int)active.size(); i++) {
            if (active[i].amount > maxCredit) { maxCredit = active[i].amount; maxCreditIdx = i; }
            if (active[i].amount < -maxDebit) { maxDebit = -active[i].amount; maxDebitIdx = i; }
        }

        if (maxCredit < EPSILON && maxDebit < EPSILON) {
            res.steps.push_back(infoStep("All balances settled"));
            break;
        }

        auto& cr = active[maxCreditIdx];
        auto& db = active[maxDebitIdx];

        res.steps.push_back(selectStep(cr.person, db.person,
            "Greedy: Found max creditor " + cr.person + " (" + fmtInt(cr.amount) +
            ") and max debtor " + db.person + " (" + fmtInt(std::abs(db.amount)) + ")"));

        double settle = std::min(cr.amount, maxDebit);
        res.transactions.push_back({db.person, cr.person, settle});
        res.steps.push_back(txnStep(db.person, cr.person, settle,
            db.person + " pays " + fmtDec(settle) + " to " + cr.person));

        cr.amount -= settle;
        db.amount += settle;

        if (cr.amount < EPSILON)
            res.steps.push_back(infoStep(cr.person + " settled completely"));
        if (std::abs(db.amount) < EPSILON)
            res.steps.push_back(infoStep(db.person + " settled completely"));
    }
    return res;
}

// =====================================================
// ALGORITHM 2: HEAP-BASED - uses std::priority_queue
// Real max-heap data structure (not simulated with sort)
// =====================================================

static AlgorithmResult heapBasedAlgorithm(std::vector<Balance> balances) {
    AlgorithmResult res;

    // Build heaps using std::priority_queue (actual binary heap)
    std::priority_queue<HeapEntry> creditHeap, debitHeap;
    std::vector<std::string> allPeople;

    for (const auto& b : balances) {
        if (b.amount > EPSILON) {
            creditHeap.push({b.amount, b.person});
            allPeople.push_back(b.person);
        }
        if (b.amount < -EPSILON) {
            debitHeap.push({-b.amount, b.person});
            allPeople.push_back(b.person);
        }
    }

    res.steps.push_back(infoStep("Building max-heaps for creditors and debtors (std::priority_queue)"));
    res.steps.push_back(considerStep(allPeople));

    while (!creditHeap.empty() && !debitHeap.empty()) {
        // Extract top of each heap (O(log N) operation)
        HeapEntry cr = creditHeap.top(); creditHeap.pop();
        HeapEntry db = debitHeap.top(); debitHeap.pop();

        res.steps.push_back(selectStep(cr.person, db.person,
            "Heap top: " + db.person + " (" + fmtInt(db.amount) +
            ") -> " + cr.person + " (" + fmtInt(cr.amount) + ")"));

        double settle = std::min(cr.amount, db.amount);
        res.transactions.push_back({db.person, cr.person, settle});
        res.steps.push_back(txnStep(db.person, cr.person, settle,
            "Transaction: " + fmtDec(settle)));

        cr.amount -= settle;
        db.amount -= settle;

        // Push back if not settled (O(log N) heap insertion)
        if (cr.amount > EPSILON) {
            creditHeap.push(cr);
        } else {
            res.steps.push_back(infoStep("Removing " + cr.person + " from heap"));
        }
        if (db.amount > EPSILON) {
            debitHeap.push(db);
        } else {
            res.steps.push_back(infoStep("Removing " + db.person + " from heap"));
        }
        res.steps.push_back(infoStep("Re-heapifying..."));
    }
    return res;
}

// =====================================================
// ALGORITHM 3: SORTING-BASED - std::sort + two pointers
// Uses: std::sort with custom comparator, two-pointer
// =====================================================

static AlgorithmResult sortingAlgorithm(std::vector<Balance> balances) {
    AlgorithmResult res;
    auto active = getActive(balances);

    res.steps.push_back(infoStep("Sorting all balances from positive to negative"));

    // std::sort with custom comparator (O(N log N))
    std::sort(active.begin(), active.end(),
        [](const Balance& a, const Balance& b) { return b.amount < a.amount; });

    res.steps.push_back(considerStep(getNames(active)));

    // Two-pointer technique
    int left = 0, right = (int)active.size() - 1;

    while (left < right) {
        auto& cr = active[left];
        auto& db = active[right];

        if (cr.amount < EPSILON) {
            res.steps.push_back(infoStep("Skipping " + cr.person + " (settled)"));
            left++; continue;
        }
        if (db.amount > -EPSILON) {
            res.steps.push_back(infoStep("Skipping " + db.person + " (settled)"));
            right--; continue;
        }

        res.steps.push_back(selectStep(cr.person, db.person,
            "Two-pointer: " + db.person + " and " + cr.person));

        double settle = std::min(cr.amount, -db.amount);
        res.transactions.push_back({db.person, cr.person, settle});
        res.steps.push_back(txnStep(db.person, cr.person, settle,
            "Settling " + fmtDec(settle)));

        cr.amount -= settle;
        db.amount += settle;

        if (cr.amount < EPSILON) {
            res.steps.push_back(infoStep(cr.person + " settled, moving left pointer"));
            left++;
        }
        if (db.amount > -EPSILON) {
            res.steps.push_back(infoStep(db.person + " settled, moving right pointer"));
            right--;
        }
    }
    return res;
}

// =====================================================
// ALGORITHM 4: MIN CASH FLOW RECURSIVE
// Uses: Recursion with std::vector mutation
// =====================================================

static void minCashFlowRecurse(std::vector<Balance>& active, AlgorithmResult& res) {
    res.steps.push_back(considerStep(getNames(active)));

    int maxCreditIdx = -1, maxDebitIdx = -1;
    double maxCredit = 0, maxDebit = 0;

    for (int i = 0; i < (int)active.size(); i++) {
        if (active[i].amount > maxCredit) { maxCredit = active[i].amount; maxCreditIdx = i; }
        if (active[i].amount < maxDebit) { maxDebit = active[i].amount; maxDebitIdx = i; }
    }

    if (maxCredit < EPSILON && -maxDebit < EPSILON) {
        res.steps.push_back(infoStep("All balances settled"));
        return;
    }

    res.steps.push_back(selectStep(active[maxCreditIdx].person, active[maxDebitIdx].person,
        "Max creditor: " + active[maxCreditIdx].person +
        ", Max debtor: " + active[maxDebitIdx].person));

    double settle = std::min(maxCredit, -maxDebit);
    res.transactions.push_back({active[maxDebitIdx].person, active[maxCreditIdx].person, settle});
    res.steps.push_back(txnStep(active[maxDebitIdx].person, active[maxCreditIdx].person, settle,
        "Recursive step: " + fmtDec(settle)));

    active[maxCreditIdx].amount -= settle;
    active[maxDebitIdx].amount += settle;

    minCashFlowRecurse(active, res);
}

static AlgorithmResult minCashFlowAlgorithm(std::vector<Balance> balances) {
    AlgorithmResult res;
    auto active = getActive(balances);

    if (active.empty()) {
        res.steps.push_back(infoStep("No transactions needed"));
        return res;
    }

    res.steps.push_back(infoStep("Finding optimal solution recursively"));
    minCashFlowRecurse(active, res);
    return res;
}

// =====================================================
// ALGORITHM 5: PRIORITY QUEUE - std::priority_queue
// Maintains dynamic priority queues with explicit priorities
// =====================================================

static AlgorithmResult priorityQueueAlgorithm(std::vector<Balance> balances) {
    AlgorithmResult res;

    std::priority_queue<HeapEntry> creditPQ, debitPQ;
    std::vector<std::string> allPeople;

    for (const auto& b : balances) {
        if (b.amount > EPSILON) {
            creditPQ.push({b.amount, b.person});
            allPeople.push_back(b.person);
        }
        if (b.amount < -EPSILON) {
            debitPQ.push({-b.amount, b.person});
            allPeople.push_back(b.person);
        }
    }

    res.steps.push_back(infoStep("Using priority queues for optimal matching"));
    res.steps.push_back(considerStep(allPeople));

    while (!creditPQ.empty() && !debitPQ.empty()) {
        HeapEntry cr = creditPQ.top(); creditPQ.pop();
        HeapEntry db = debitPQ.top(); debitPQ.pop();

        res.steps.push_back(selectStep(cr.person, db.person,
            "Priority match: " + db.person + " (priority: " + fmtInt(db.amount) +
            ") -> " + cr.person + " (priority: " + fmtInt(cr.amount) + ")"));

        double settle = std::min(cr.amount, db.amount);
        res.transactions.push_back({db.person, cr.person, settle});
        res.steps.push_back(txnStep(db.person, cr.person, settle,
            "Priority transaction: " + fmtDec(settle)));

        cr.amount -= settle;
        db.amount -= settle;

        if (cr.amount < EPSILON) {
            res.steps.push_back(infoStep("Dequeuing " + cr.person));
        } else {
            creditPQ.push({cr.amount, cr.person});
        }
        if (db.amount < EPSILON) {
            res.steps.push_back(infoStep("Dequeuing " + db.person));
        } else {
            debitPQ.push({db.amount, db.person});
        }
    }
    return res;
}

// =====================================================
// EXPORTED C FUNCTIONS (called from Web Worker via ccall)
// Each takes a JSON string, returns a JSON string
// =====================================================

// We need to keep the returned string alive until next call
static std::string lastResult;

extern "C" {

EMSCRIPTEN_KEEPALIVE
const char* run_greedy(const char* input) {
    auto balances = parseInput(std::string(input));
    lastResult = serialize(greedyAlgorithm(balances));
    return lastResult.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char* run_heap_based(const char* input) {
    auto balances = parseInput(std::string(input));
    lastResult = serialize(heapBasedAlgorithm(balances));
    return lastResult.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char* run_sorting(const char* input) {
    auto balances = parseInput(std::string(input));
    lastResult = serialize(sortingAlgorithm(balances));
    return lastResult.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char* run_min_cashflow(const char* input) {
    auto balances = parseInput(std::string(input));
    lastResult = serialize(minCashFlowAlgorithm(balances));
    return lastResult.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char* run_priority_queue(const char* input) {
    auto balances = parseInput(std::string(input));
    lastResult = serialize(priorityQueueAlgorithm(balances));
    return lastResult.c_str();
}

} // extern "C"
