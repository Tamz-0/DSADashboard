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
int res=0;
    int fun(TreeNode* root,int s){
        if(root==NULL)return 0;
        s=s*10+root->val;
        if(root->left==NULL&&root->right==NULL)res+=s;
        fun(root->left,s);
        fun(root->right,s);
        return res;

    }
    int sumNumbers(TreeNode* root) {
        return fun(root,0);
    }
};