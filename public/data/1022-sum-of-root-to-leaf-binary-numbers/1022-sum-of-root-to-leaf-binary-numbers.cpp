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
    int sumRootToLeaf(TreeNode* root) {
        int res=0;
        queue<pair<TreeNode*,int>>q;
        q.push({root,root->val});
        while(!q.empty()){
            auto[t,val]=q.front();
            q.pop();
            if(!t->left&&!t->right)res+=val;
            if(t->left)q.push({t->left,2*val+t->left->val});
            if(t->right)q.push({t->right,2*val+t->right->val});
        }
        return res;
    }
};