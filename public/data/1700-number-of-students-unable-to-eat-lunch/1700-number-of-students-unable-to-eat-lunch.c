int countStudents(int* students, int studentsSize, int* sandwiches, int sandwichesSize) {
    int st = studentsSize;
    int count = 0;
    int i = 0;
    int flag = 0;
    while(1) {
        if(students[i] == sandwiches[count]) {
            count++;
            students[i] = 2;
            flag = 1;
            if(count == st) {
                break;
            }
        }
        i++;
        if(i == st && flag == 1) {
            i = 0;
            flag = 0;
            continue;
        }
        else if(i == st && flag == 0) {
            break;
        }
    }
    count = 0;
    for(int i = 0 ; i < st ; i++) {
        if(students[i] != 2) {
            count++;
        }
    }
    return count;   
}