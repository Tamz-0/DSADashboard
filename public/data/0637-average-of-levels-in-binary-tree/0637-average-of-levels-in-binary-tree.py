# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def averageOfLevels(self, r: Optional[TreeNode]) -> List[float]:
        return [sum(n.val for n in q)/len(q) for q in takewhile(bool,accumulate(count(),
            lambda q,_:[c for n in q for c in (n.left,n.right) if c],initial=[r]))]