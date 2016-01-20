var Step = require('step'),
    fs = require('fs'),
    sys = require('sys');

function my_function(arg_array,arg_callback)
{
    Step(
      function () {
       if(arg_array.length==0)
       {
           arg_callback(null,{})  // don't create group_slots if the array is empty
                                  // otherwise it will not go to the next step
       }
       else
        {
         var group_slots = this.group();
         console.log(group_slots);
         arg_array.forEach(function (num) {
           var group_slot=group_slots();
           fs.readFile(__filename + num, group_slot); 
           //console.log(group_slot());
         });
         console.log("end foreach");
       }

      },
      function (err, contents) {
        if (err) { }
        else
        {
          arg_callback(null,contents);
        }
      }
    );
}

my_function([1,2,3,4,5,6],function (err,contents){
 console.log(contents);
})