class Solution:
    def minCostToMoveChips(self, position: List[int]) -> int:
        evenCount = 0
        oddCount = 0

        for pos in position:
            if pos % 2:
                oddCount += 1
            else:
                evenCount += 1
        return min(oddCount, evenCount)