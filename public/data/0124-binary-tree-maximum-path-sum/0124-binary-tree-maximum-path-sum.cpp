/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    int dfs(TreeNode* root,int&res){
        if(!root)return 0;
        int lt=max(0,dfs(root->left,res));
        int rt=max(0,dfs(root->right,res));
        res=max(res,lt+rt+root->val);
        return root->val+max(lt,rt);
    }
    int maxPathSum(TreeNode* root) {
        if(!root)return 0;
        int res=INT_MIN;
        dfs(root,res);
        return res;
    }
};