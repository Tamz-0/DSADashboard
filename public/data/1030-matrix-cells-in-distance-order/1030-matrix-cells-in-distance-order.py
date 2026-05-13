class Solution:
    def allCellsDistOrder(self, rows: int, cols: int, rCenter: int, cCenter: int) -> List[List[int]]:
        distance=defaultdict(list)
        for i in range(rows):
            for j in range(cols):
                dist=abs(i-rCenter)+abs(j-cCenter)
                distance[dist].append([i,j])
        ans=[]
        for dist in range(rows+cols):
            ans.extend(distance[dist])
        return ans