class Solution:
    def uniqueMorseRepresentations(self, words: List[str]) -> int:
        result = set()

        code = [".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."]

        for i in words:
            l = ""

            for j in i:
                l += code[ord(j)-97]
            result.add(l)
        return len(result)        