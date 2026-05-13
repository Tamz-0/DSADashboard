class Solution {
public:
    int countSegments(string s) {
        int total = 0;
        for(int i = 0; i < s.size(); ++i)
        {
            string str = "";
            while(i < s.size() && s[i] != ' ')
            {
                str += s[i];
                i++;
            }
            if(str.size() > 0) total++;
        }
        return total;
    }
};