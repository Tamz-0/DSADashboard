class Solution {
public:
    char repeatedCharacter(string s) {
        set<char>ch;
        for(char i:s){  
            if(ch.find(i)!=ch.end()){
                return i;
            }else{
                ch.insert(i);
            }

        }
        return 0;
        
    }
};