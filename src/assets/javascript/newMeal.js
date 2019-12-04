const modelURL = '/ml_models/tm-my-image-model/';
let model, maxPredictions;

const listaItensInseridos = [];

async function init() {
    const jsonModelURL = modelURL + 'model.json';
    const metadataURL = modelURL + 'metadata.json';

    model = await tmImage.load(jsonModelURL, metadataURL);
    console.log("Model loaded.");
    maxPredictions = model.getTotalClasses();
    
    criarTitulosTabelaAlimentos();
}
init();

async function uploadImage() {
    let uploadedFile = document.getElementById("input-img").files[0];
    let imgContainer = document.getElementById('foodImage');
    imgContainer.src = URL.createObjectURL(uploadedFile);
}

async function predict() {
    let response = await model.predict(document.getElementById('foodImage'));
    return response;
}

function criarTitulosTabelaAlimentos(){
    let tabela = document.getElementById('tabelaAlimento');
    let line = document.createElement('tr');
    
    let food = document.createElement('th');
    let foodText = document.createTextNode('Alimento');
    food.appendChild(foodText);
    
    let kcal = document.createElement('th');
    let kcalText = document.createTextNode('Kcal');
    kcal.appendChild(kcalText);
    
    let protein = document.createElement('th');
    let proteinText = document.createTextNode('Proteínas');
    protein.appendChild(proteinText);
    
    let carbohydrate = document.createElement('th');
    let carbohydrateText = document.createTextNode('Carboidratos');
    carbohydrate.appendChild(carbohydrateText);
    
    let fiber = document.createElement('th');
    let fiberText = document.createTextNode('Fibras');
    fiber.appendChild(fiberText);
    
    let quantity = document.createElement('th');
    let quantityText = document.createTextNode('Quantidade');
    quantity.appendChild(quantityText);
    
    line.appendChild(food);
    line.appendChild(kcal);
    line.appendChild(protein);
    line.appendChild(carbohydrate);
    line.appendChild(fiber);
    line.appendChild(quantity);
    
    tabela.appendChild(line);
    
}

function insertFoodItem(pf) {
    // Se há alimento identificado pelo modelo,
    // inserir o nome numa lista
    
    if(Object.keys(pf).length > 0){
        
        let tabela = document.getElementById('tabelaAlimento');
        let line = document.createElement('tr');

        let food = document.createElement('td');
        let kcal = document.createElement('td');
        let protein = document.createElement('td');
        let carbohydrate = document.createElement('td');
        let fiber = document.createElement('td');
        let quantity = document.createElement('td');
        
        let addButton = document.createElement('button');
        addButton.innerHTML = "+";

        let removeButton = document.createElement('button');
        removeButton.innerHTML = "-";

        quantity.appendChild(addButton);
        quantity.appendChild(removeButton);
        
        let predictionTextNode = document.createTextNode(pf.className);
        console.log(predictionTextNode);
        food.append(predictionTextNode);
        
        line.appendChild(food);
        line.appendChild(kcal);
        line.appendChild(protein);
        line.appendChild(carbohydrate);
        line.appendChild(fiber);
        line.appendChild(quantity);

        tabela.appendChild(line);
        
    }
    
}

// Event listener que escuta as mudanças de imagens.
// Quando uma nova imagem carregar, prever o alimento
// que está nela.
const imgTag = document.getElementById('foodImage');
imgTag.addEventListener('load', async e =>{
    let predictedFood = {};
    const response = await predict();
    predictedFood = myNewMeal.getFoodWithHighestProbability(response);
    insertFoodItem(predictedFood);
}, false);

const fileInput = document.getElementById("input-img");
fileInput.addEventListener('change', e => {
    uploadImage();
}, false);