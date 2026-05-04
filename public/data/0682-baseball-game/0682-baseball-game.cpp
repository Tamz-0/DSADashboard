class Solution {
public:
    int calPoints(vector<string>& operations) {
        vector<int> ans;
        int n = operations.size();
        for (int i = 0; i < n; i++) {
            if (operations[i] != "C" && operations[i] != "D" &&
                operations[i] != "+") {
                int k = stoi(operations[i]);
                ans.push_back(k);
            } else if (operations[i] == "+") {
                int k = ans[ans.size() - 1] + ans[ans.size() - 2];
                ans.push_back(k);
            } else if (operations[i] == "C")
                ans.pop_back();
            else {
                int k = 2 * ans[ans.size() - 1];
                ans.push_back(k);
            }
        }

        int sum = 0;
        for (int i = 0; i < ans.size(); i++) {
            sum += ans[i];
        }

        return sum;
    }
};