# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isCousins(self, root: Optional[TreeNode], x: int, y: int) -> bool:
        
        self.dx = -1
        self.dy = -1
        self.px = None
        self.py = None

        def dfs(node, parent, depth):
            if not node:
                return

            if node.val == x:
                self.dx = depth
                self.px = parent

            if node.val == y:
                self.dy = depth
                self.py = parent

            dfs(node.left, node, depth + 1)
            dfs(node.right, node, depth + 1)

        dfs(root, None, 0)

        return self.dx == self.dy and self.px != self.py       