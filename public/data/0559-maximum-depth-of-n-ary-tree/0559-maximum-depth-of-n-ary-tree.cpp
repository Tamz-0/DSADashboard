/*
// Definition for a Node.
class Node {
public:
    int val;
    vector<Node*> children;

    Node() {}

    Node(int _val) {
        val = _val;
    }

    Node(int _val, vector<Node*> _children) {
        val = _val;
        children = _children;
    }
};
*/

class Solution {
public:
    int maxDepth(Node* root) {
        if(!root)return 0;
        queue<Node*>q;
        q.push(root);
        int h=0;
        while(!q.empty()){
            int s=q.size();
            while(s--){
                Node* t=q.front();
                q.pop();
                for(auto&it:t->children){
                    q.push(it);
                }
            }
            h++;
        }
        return h;
    }
};