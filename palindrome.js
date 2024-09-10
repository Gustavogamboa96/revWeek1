function isPalindrome(str){

    let newstr = str.toLowerCase().replace(/[^a-z0-9]/g, '');

    for(i =0 ; i < newstr.length; i++){
        if(newstr[i] != newstr[newstr.length -1 - i]){
            return false;
        }
    }
    return true;
}

console.log(isPalindrome("1228781"));