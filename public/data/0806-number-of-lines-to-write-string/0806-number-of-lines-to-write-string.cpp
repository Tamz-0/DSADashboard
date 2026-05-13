class Solution {
public:
    vector<int> numberOfLines(vector<int>& widths, string s) {
        int n, sum = 0, line = 1;
        for(int i = 0; i < s.size(); i++){
            n = s[i] - 'a';
            sum += widths[n];
            if(sum > 100){
                sum = 0;
                line++;
                sum += widths[n];
            }
        }
        return {line,sum};
    }
};