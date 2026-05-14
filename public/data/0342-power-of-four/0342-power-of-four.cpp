class Solution {
public:
    bool isPowerOfFour(int n) {
        if (n <= 0) {
            return false;
        }
        return fmod(log(n) / log(4), 1.0) == 0.0;        
    }
};