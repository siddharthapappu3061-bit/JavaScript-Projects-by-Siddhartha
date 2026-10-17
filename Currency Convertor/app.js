const convertButton = document.getElementById("convertor");
const workSpace = document.getElementById("work-area");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amount = document.getElementById('amount');

convertButton.addEventListener("click", () => {
    convertingMoney(fromCurrency.value,toCurrency.value,amount.value)
    .then(value=>{
        const printedValue = document.createElement("h2");
        printedValue.textContent=`${fromCurrency.value} ${amount.value} = ${toCurrency.value} ${value.toFixed(2)}`;
        workSpace.appendChild(printedValue);
        convertButton.addEventListener("click", () => {
            printedValue.remove();
        });
    })
    .catch(error =>{
        return ("Error", error);
    });
});

const convertingMoney = async (fromCurrency, toCurrency, amount) => {
    try{
        const priceConversion = await fetch(`https://v6.exchangerate-api.com/v6/181e97b7b49eba8f54f6586c/latest/${fromCurrency}`);
        if(!priceConversion.ok) throw new Error("Network response failed");
        const data = await priceConversion.json();
        const rates = data.conversion_rates[toCurrency];
        return amount * rates;
    }
    catch(error){
        return ("Error: ", error);
    }
}

const dropdownCountries = async () => {
    try{
        let offset = 0;
        let more = true;
        while(more){
            const countries = await fetch(`https://api.restcountries.com/countries/v5?limit=25&offset=${offset}`,
            { headers: { 'Authorization': 'Bearer rc_live_457695f9093245c39857885fbb0355e8' } }
            );
            const data = (await countries.json()).data;
            const information = data.objects;
            information.forEach(country => {
                if(!country.currencies || country.currencies.length === 0){
                    return;
                }
                const option = document.createElement("option");
                option.value = (country.currencies[0].code);
                option.innerText = `${country.currencies[0].code} - ${country.names.common}`;
                fromCurrency.appendChild(option);
            });
            information.forEach(country => {
                if(!country.currencies || country.currencies.length === 0){
                    return;
                }
                const option = document.createElement("option");
                option.value = (country.currencies[0].code);
                option.innerText = `${country.currencies[0].code} - ${country.names.common}`;
                toCurrency.appendChild(option);
            });
            more = data.meta.more;
            offset += 25; 
        }
    }
    catch(error){
        return ("Error: ", error);
    }
}

dropdownCountries();