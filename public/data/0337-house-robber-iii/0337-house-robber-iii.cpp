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
    unordered_map<TreeNode*,int>dp;
    int fun(TreeNode* root){
        if(root==NULL)return 0;
        if(dp[root])return dp[root];
        int take=root->val;
        if(root->left){
            take+=fun(root->left->left)+fun(root->left->right);
        }
        if(root->right){
            take+=fun(root->right->left)+fun(root->right->right);
        }
        int skip=fun(root->left)+fun(root->right);
        return dp[root]=max(take,skip);
    }
    int rob(TreeNode* root) {
        return fun(root);
    }
};