


let tableBody=document.getElementById("tableBody");
let loadingOff=document.querySelector(".loadingOff");
let editContainer=document.querySelector(".editContainer");
let errorContainer=document.querySelector(".errorContainer");
let successContainer=document.querySelector(".successContainer");
let removeAddContainer=document.getElementById("removeAddContainer");
let removeEditContainer=document.getElementById("removeEditContainer");
let submitEditData=document.getElementById("submitEditData");
let errorText=document.getElementById("errorText")
let deleteContainer=document.querySelector(".deleteContainer");
let keyParameters=["name","gender","email","status"]
let deleteButton=document.getElementById("deleteButton");
let cancelButton=document.getElementById("cancelButton");
let customerAddBtn=document.getElementById("customerAddBtn");
let searchCustomer=document.querySelector(".searchCustomer");
let searchButton=document.getElementById("searchButton");
cancelButton.onclick=function(){
    deleteContainer.classList.add("deleteContainer")
}
removeEditContainer.onclick=function(){
    editContainer.classList.add("editContainer");
}
successContainer.onclick=function(){
    successContainer.classList.add("successContainer");
}
errorContainer.onclick=function(){
    errorContainer.classList.add("errorContainer");
}


function resetValues(){
    for(let eachKey of keyParameters){
        let inputGiven=document.getElementById("edit"+eachKey);
        inputGiven.value="";
    }
}
function addAndUpdate(method, URL, tableRow) {
    editContainer.classList.remove("editContainer");
    submitEditData.addEventListener("click", function() {
      editContainer.classList.add("editContainer");
      loadingOff.classList.remove("loadingOff");
  
      let sendingObj = {};
      let execution = true;
  
      for (let eachKey of keyParameters) {
        console.log(eachKey);
        let inputGiven = document.getElementById("edit" + eachKey);
  
        if (method === "POST") {
          if (inputGiven.value === "") {
            execution = false;
            loadingOff.classList.add("loadingOff");
            errorText.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> form filled Incompletely`;
            errorContainer.classList.remove("errorContainer");
            break;
          }
        }
  
        if (inputGiven.value !== "") {
          sendingObj[eachKey] = inputGiven.value;
        }
      }
  
      if (execution) {
        console.log(sendingObj);
  
        async function makeRequest(url, method, sendingObj) {
          const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:
              "Bearer 95653e7c533f364b325a0e3c388be50bf0a56f3e69cb7fbb11d8be2c54666d9c",
          };
  
          const options = {
            method: method,
            headers: headers,
            body: JSON.stringify(sendingObj)
          };
  
          try {
            const response = await fetch(url, options);
            const statusCode=response.status;
            const data = await response.json();
  
            if (response.ok) {
              if (method === "PUT") {
                for (let nodeNo = 0; nodeNo < keyParameters.length; nodeNo++) {
                  let tableData = tableRow.querySelector(`td:nth-child(${nodeNo+1})`);
                  if (Object.keys(sendingObj).includes(keyParameters[nodeNo])) {
                    if(nodeNo==keyParameters.length-1){
                        let pElement=tableData.querySelector("p:nth-child(1)");
                        pElement.textContent=sendingObj[keyParameters[nodeNo]];
                        continue;
                    }
                    tableData.textContent = sendingObj[keyParameters[nodeNo]];
                  }
                }
              }
              else {
                addCustomers([data]);
                successContainer.classList.remove("successContainer");
              }
              loadingOff.classList.add("loadingOff");
             
            }else {
                loadingOff.classList.add("loadingOff");
                errorText.innerHTML = `<i class="fa-thin fa-wifi-slash"></i> ${data[0].field} ${ data[0].message} 😲`;
                errorContainer.classList.remove("errorContainer");
              }
          } catch (error) {
              loadingOff.classList.add("loadingOff");
              errorText.innerHTML = `<i class="fa-thin fa-wifi-slash"></i> ${error}`;
              errorContainer.classList.remove("errorContainer");
          }
        }
  
        makeRequest(URL, method, sendingObj);
      }
    });
  }
  

function editCustomer(id,tableRow){
    return function(){
        let URL="https://gorest.co.in/public/v2/users"+"/"+id;
        addAndUpdate("PUT",URL,tableRow);
    }
}
// it will deleteCustomer

function deleteCustomer(id,tableRow){
    return function(){
        deleteContainer.classList.remove("deleteContainer");
        deleteButton.onclick=function(){
            deleteContainer.classList.add("deleteContainer");
            loadingOff.classList.remove("loadingOff");
            let URL="https://gorest.co.in/public/v2/users"+"/"+id;
            console.log(URL);
            fetch(URL,{
                method:"DELETE",
                headers:{
                    Authorization: "Bearer 95653e7c533f364b325a0e3c388be50bf0a56f3e69cb7fbb11d8be2c54666d9c"
                }
            }).then(function(response){
                return response.ok;
            }).then(function(data){
                if(data){
                    tableBody.removeChild(tableRow);
                    loadingOff.classList.add("loadingOff");
                    successContainer.classList.remove("successContainer");

                }
                else{
                    loadingOff.classList.add("loadingOff");
                    errorText.innerHTML=`<i class="fa-thin fa-wifi-slash"></i> Unable delete this Element`
                    errorContainer.classList.remove("errorContainer");
                }
            }).catch(function(error){
                loadingOff.classList.add("loadingOff");
                errorText.innerHTML=`<i class="fa-thin fa-wifi-slash"></i> ${error}`
                errorContainer.classList.remove("errorContainer");
            })

        }
    }
}

searchButton.onclick=function(){
    loadingOff.classList.remove("loadingOff");
    let URL="https://gorest.co.in/public/v2/users"+"/"+searchCustomer.value;
    async function makeRequest(url, method) {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer 95653e7c533f364b325a0e3c388be50bf0a56f3e69cb7fbb11d8be2c54666d9c"
        };
      
        const options = {
          method: method,
          headers: headers,
          
        };
      
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          
          if (response.ok) {
            tableBody.innerHTML="";
            addCustomers([data]);
            successContainer.classList.remove("successContainer");
            loadingOff.classList.add("loadingOff");
          } else {
            const status = response.status;
            loadingOff.classList.add("loadingOff");
            errorText.innerHTML = `<i class="fa-thin fa-wifi-slash"></i> ${status} : No results Found`
            errorContainer.classList.remove("errorContainer");
          }
        } catch (error) {
          loadingOff.classList.add("loadingOff");
          errorText.innerHTML = `<i class="fa-thin fa-wifi-slash"></i> ${error}`
          errorContainer.classList.remove("errorContainer");
        }
      }
      makeRequest(URL, "GET");
};

searchCustomer.addEventListener("keyup", function(e) {
  if(e.key==="Backspace" && searchCustomer.value===""){
    tableBody.innerHTML="";
    databaseGet();
  }
});


function addCustomers(listOfCustomers){
    for(let eachCustomer of listOfCustomers){
        let tableRow=document.createElement("tr");
        tableRow.innerHTML=`<tr>
        <td>${eachCustomer.name}</td>
        <td>${eachCustomer.gender}</td>
        <td>${eachCustomer.email}</td>
        <td>
            <p>${eachCustomer.status}</p>
            <div class="menubar" id="${"menubar"+eachCustomer.id}">
                <i class="fa-solid fa-ellipsis-vertical menuIcon"></i>
                <div class="box hide" id="${"box"+eachCustomer.id}">
                    <p id="${"editButton"+eachCustomer.id}"><i class="fa-solid fa-pen-to-square fontawesome-icon"></i>Edit</p>
                    <p id="${"deleteButton"+eachCustomer.id}"><i class="fa-solid fa-trash fontawesome-icon"></i> Delete</p>
                </div>
            </div>
        </td>
    </tr>`
        console.log(eachCustomer.id +" for "+eachCustomer.name)
        tableBody.appendChild(tableRow);
        let editButton=document.getElementById("editButton"+eachCustomer.id);
        let deleteButton=document.getElementById("deleteButton"+eachCustomer.id);
        let modal=document.querySelector("#menubar"+eachCustomer.id);
        let box=document.querySelector("#box"+eachCustomer.id);
        modal.addEventListener("click",function(){
            box.classList.toggle("hide");
            if(box.classList.contains("hide")){
                modal.style.backgroundColor="transparent";
                modal.style.padding="0px";
            }else{
                modal.style.backgroundColor="white";
                modal.style.padding="5px";
            }
            
        })
        editButton.onclick=editCustomer(eachCustomer.id,tableRow);
        deleteButton.onclick=deleteCustomer(eachCustomer.id,tableRow)
        customerAddBtn.addEventListener("click",function(){
          addAndUpdate("POST","https://gorest.co.in/public/v2/users",tableRow);
      })

    }
    loadingOff.classList.add("loadingOff");
}

loadingOff.classList.remove("loadingOff")

function databaseGet(){
    fetch("https://gorest.co.in/public/v2/users/",{
        method:"GET"
    }).then(function(response){
        return response.json();
    }).then(function(listOfCustomers){
        console.log(listOfCustomers)
        addCustomers(listOfCustomers);
    });
    
}
databaseGet();
