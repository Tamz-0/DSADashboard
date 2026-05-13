class Solution(object):
    def maxCount(self, m, n, ops):
        if not ops:
            return m * n
        min_a = min(op[0] for op in ops)
        min_b = min(op[1] for op in ops)
        return min_a * min_b