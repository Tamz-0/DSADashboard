class Solution {
public:
    int findDelayedArrivalTime(int arrivalTime, int delayedTime) {
        int x =arrivalTime+delayedTime;
        return x>23?x-24:x;
        
    }
};