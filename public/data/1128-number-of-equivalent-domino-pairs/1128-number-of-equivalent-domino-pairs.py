class Solution:
    def numEquivDominoPairs(self, dominoes: List[List[int]]) -> int:
        l = [','.join([str(x) for x in sorted(el)]) for el in dominoes]
        return int(sum((v*(v-1)/2 for v in Counter(l).values() if v != 1)))