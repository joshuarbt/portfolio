
// script age 
const birthDate = new Date(2007, 4, 8);

function getAge(date) {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();

    if (today.getMonth() > date.getMonth() || (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate())) {
        return age;
    }else {
        return age - 1;
    }
}

document.getElementById("age").textContent = 'Age : ' + getAge(birthDate) + ' yo';