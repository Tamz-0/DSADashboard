class Solution:
    def detectCapitalUse(self, word):

        if len(word) < 2:
            return True

        if word[0].isupper() and word[1].isupper():

            for i in range(2, len(word)):
                if not word[i].isupper():
                    return False

        elif word[0].isupper() and not word[1].isupper():

            for i in range(2, len(word)):
                if word[i].isupper():
                    return False

        else:

            for ch in word:
                if ch.isupper():
                    return False

        return True