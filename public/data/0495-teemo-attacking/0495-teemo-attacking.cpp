class Solution {
public:
    int findPoisonedDuration(vector<int>& timeSeries, int duration) {
        int n = timeSeries.size();
        int count = 0;

        for(int i = 0; i < n - 1; i++) {
            int gap = timeSeries[i + 1] - timeSeries[i];
            count += min(gap, duration);
        }

        count += duration;

        return count;
    }
};