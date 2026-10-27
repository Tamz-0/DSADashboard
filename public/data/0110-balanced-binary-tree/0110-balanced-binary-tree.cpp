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
    bool isBalanced(TreeNode* root) {
        if(!root)return 1;
        queue<TreeNode*>q;
        q.push(root);
        vector<TreeNode*>nodes;
        unordered_map<TreeNode*,int>height;
        while(!q.empty()){
            TreeNode * t=q.front();
            q.pop();
            nodes.push_back(t);
            if(t->left)q.push(t->left);
            if(t->right)q.push(t->right);
        }
        for(int i=nodes.size()-1;i>=0;i--){
            TreeNode* t=nodes[i];
            int lh=(t->left)?height[t->left]:0;
            int rh=(t->right)?height[t->right]:0;
            if(abs(lh-rh)>1)return 0;
            height[t]=1+max(lh,rh);
        }
        return 1;
    }
};