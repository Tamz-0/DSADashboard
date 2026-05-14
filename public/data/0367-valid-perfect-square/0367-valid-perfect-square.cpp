class Solution {
public:
    bool isPerfectSquare(int num) {
        long beg = 1, end = num;
        while (beg <= end) {
            long mid = beg + (end - beg) / 2;
            long square = mid * mid;
            if (square == num) return true;
            else if (square > num) end = mid - 1;
            else beg = mid + 1;
        }
        return false;
    }
};