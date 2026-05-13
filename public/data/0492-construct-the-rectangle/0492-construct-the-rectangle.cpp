class Solution {
public:
    vector<int> constructRectangle(int area) {
        int start=sqrt(area);
        for(int i=start; i>0; --i){
            if (area%i==0) return {area/i, i};
        }
        return {};
    }
};