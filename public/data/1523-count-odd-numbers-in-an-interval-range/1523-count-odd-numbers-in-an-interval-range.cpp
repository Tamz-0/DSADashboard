class Solution {
public:
    int countOdds(int low, int high) {
     
        int nl=(low)/2;
        int nh=(high+1)/2;
        return (nh-nl);
    }
};