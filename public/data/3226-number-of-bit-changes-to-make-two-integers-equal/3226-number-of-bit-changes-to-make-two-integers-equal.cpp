class Solution {
public:
    int minChanges(int n, int k) {
        int count = 0;
        while (n || k) {
            int d1 = n % 2;
            int d2 = k % 2;
            n /= 2;
            k /= 2;
            if (d1 == 0 && d2 == 1)
                return -1;
            else if (d1 == 1 && d2 == 0)
                count++;
        }
        return count;
    }
};