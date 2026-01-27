var yyangfly = {
  compact: function (array) {
    let newArr = [];
    array.forEach(element => {
      if (element != false && element != null && element != 0 && element != -0 && element != 0n && element !="" && element != undefined && element != NaN) {
        newArr.push(element);
      }
    });
    return newArr;
  }
}