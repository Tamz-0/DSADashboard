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
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        if(root==NULL)return{};
        vector<vector<int>>res;
        queue<TreeNode*>q;
        bool lefttoright=1;
        q.push(root);
        while(!q.empty()){
            int l=q.size();
            vector<int>t;
            while(l--){
                TreeNode* temp=q.front();
                q.pop();
                t.push_back(temp->val);
                if(temp->left!=NULL)q.push(temp->left);
                if(temp->right!=NULL)q.push(temp->right);
            }
            if(!lefttoright) reverse(t.begin(),t.end());
            res.push_back(t);
            lefttoright=!lefttoright;
        }
        return res;
        
    }
};