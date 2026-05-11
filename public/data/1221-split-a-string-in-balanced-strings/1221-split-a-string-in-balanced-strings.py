class Solution:
    def balancedStringSplit(self, s: str) -> int: 
        count, tally , i = 0,0,0
        while i < len(s):
            if s[i] == 'L':
                count += 1  
            if s[i] == 'R': 
                count -= 1  
            if count == 0:  
                tally += 1  
            i += 1
        return tally
                   