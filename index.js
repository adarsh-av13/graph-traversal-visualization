const n = 100;

let gridItems = [];
let gridItemClicked = [];
let vertexButton, edgeButton, doneButton, resetButton, bfsButton, dfsButton;
let mode, grid, algo;
let traversalComplete;
let edges;
let vertices = [];
window.onload = () => {
    grid = document.querySelector('.grid');
    algo = document.getElementById('algo');
    order = document.getElementById('order');
    vertexButton = document.getElementById('vertex-btn');
    edgeButton = document.getElementById('edge-btn');
    doneButton = document.getElementById('done-btn');
    resetButton = document.getElementById('reset-btn');
    bfsButton = document.getElementById('bfs-btn');
    dfsButton = document.getElementById('dfs-btn');
    traversalComplete = document.getElementById('traversal');
    mode = 'done';
    edges = new Map();
    doneButton.disabled = true;
    resetButton.disabled = true;
    bfsButton.disabled = true;
    dfsButton.disabled = true;
    for (let i = 0; i < n; ++i) {
        gridItems[i] = document.createElement('div');
        gridItems[i].id = `gridbox${i}`;
        gridItems[i].classList.add('grid-box');
        gridItems[i].classList.add('halfpx-border');
        gridItems[i].addEventListener('click', addVertex);
        gridItemClicked[i] = false;
        grid.appendChild(gridItems[i]);
    }
}


function vertexMode() {
    mode = 'vertex';
    edgeButton.disabled = true;
    vertexButton.disabled = true;
    doneButton.disabled = false;
    bfsButton.disabled = true;
    dfsButton.disabled = true;
}

function edgeMode() {
    mode = 'edge';
    edgeButton.disabled = true;
    vertexButton.disabled = true;
    doneButton.disabled = false;
    bfsButton.disabled = true;
    dfsButton.disabled = true;
}

function done() {
    mode = 'done';
    if (vertices.length !== 0) {
        bfsButton.disabled = false;
        dfsButton.disabled = false;
    }
    if (firstPress == false) {
        firstVertex.parentElement.removeChild(firstCircle);
        firstVertex.classList.remove("selected");
    }
    edgeButton.disabled = false;
    vertexButton.disabled = false;
    doneButton.disabled = true;
}

function addVertex(e) {
    if (mode !== 'vertex')
        return;
    let gridBox = e.target;

    if (e.target.classList.contains('grid-box') && document.getElementById(gridBox.id + 'vertex') === null) {
        let gridCircle = document.createElement('div');
        gridCircle.id = `${gridBox.id}vertex`;
        gridCircle.classList.add('circle');
        gridCircle.classList.add('vertex');
        gridCircle.classList.add('centered');
        let count = vertices.length;
        gridCircle.innerText = `${count}`;
        gridCircle.addEventListener('click', addEdge);
        gridBox.appendChild(gridCircle);
        vertices.push(gridCircle.id);
    }
}

let firstPress = true;
let firstVertex;
let firstCircle;


function addEdge(e) {
    if (mode !== 'edge')
        return;
    let parent = e.target.parentElement;
    let vertex = parent.firstChild;
    vertex.classList.add('selected');
    if (!firstPress) {
        firstVertex.classList.remove('selected');
        vertex.classList.remove('selected');
        if (firstVertex == vertex) {
            firstPress = true;
            firstVertex = null;
            return;
        }
        if (edges.has(firstVertex.id) && edges.get(firstVertex.id).includes(vertex.id))
            return;
        if (!edges.has(firstVertex.id)) {
            edges.set(firstVertex.id, [vertex.id]);
        } else {
            edges.get(firstVertex.id).push(vertex.id);
        }
        if (!edges.has(vertex.id)) {
            edges.set(vertex.id, [firstVertex.id]);
        } else {
            edges.get(vertex.id).push(firstVertex.id);
        }
        createEdge(vertex, firstVertex, false);
    } else {
        firstVertex = vertex;
    }
    firstPress = !firstPress;
}

async function createEdge(vertex, firstVertex, animation) {
    let edge = document.createElement('div');
    edge.classList.add('edge');
    let firstVertexPosition = getPosition(firstVertex);
    let secondVertexPosition = getPosition(vertex);
    let rotation = getRotation(firstVertexPosition, secondVertexPosition);
    let xOffset = Math.abs(secondVertexPosition.left - firstVertexPosition.left);
    let yOffset = Math.abs(secondVertexPosition.top - firstVertexPosition.top);
    let length = Math.sqrt(Math.pow(xOffset, 2) + Math.pow(yOffset, 2));
    edge.style.width = `0px`;
    edge.style.left = firstVertexPosition.left;
    edge.style.top = firstVertexPosition.top;
    edge.style.transform = `rotateZ(${rotation}deg`;
    edge.classList.add('centered');
    firstVertex.parentElement.appendChild(edge);
    if (animation) {
        edge.style.backgroundColor = 'green';
        edge.classList.add('visit');
        await sleep(400);
    }
    edge.style.width = `${length}px`;
    return edge;
}

function getPosition(element) {
    let left = 0,
        top = 0;
    while (element.tagName != 'BODY') {
        top += element.offsetTop;
        left += element.offsetLeft;
        element = element.parentElement;
    }
    return { left, top };
}

function getRotation(v1, v2) {
    let slope = (v2.top - v1.top) / (v2.left - v1.left);
    let deg = (Math.atan(slope) * 57.29578);
    deg = v1.left > v2.left && v1.top <= v2.top ? deg + 180 : v1.left > v2.left && v1.top > v2.top ? deg - 180 : deg;
    return Math.round(deg);
}


async function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
async function bfs() {
    algo.style.opacity = 1;
    order.style.opacity = 1;
    algo.innerText = 'Breadth First Search';
    order.innerText = 'Order:';
    dfsButton.disabled = true;
    bfsButton.disabled = true;
    vNo = document.getElementById("start-vertex").value;
    if (vNo > vertices.length) {
        alert("Invalid Input");
        return;
    }
    // removeAllEdges();
    let vertexCopy = [...vertices];
    let visited = [];
    let parent = Array(vertices.length).fill(null);
    let start = vertices[vNo];
    let queue = [start];
    while (queue.length > 0) {
        let currentVertex = queue.shift();
        let rIndex = vertexCopy.indexOf(currentVertex);
        vertexCopy.splice(rIndex, 1);
        await sleep(500);
        let currentParent = parent[vertices.indexOf(currentVertex)];
        if (currentParent !== null) {
            createEdge(document.getElementById(currentVertex), document.getElementById(currentParent), true);
        }
        await sleep(1000);
        document.getElementById(currentVertex).style.backgroundColor = 'green';
        visited.push(currentVertex);
        order.innerText += ` ${vertices.indexOf(currentVertex)}`;
        let neighbours = edges.get(currentVertex);
        if (neighbours !== undefined) {
            neighbours.forEach(element => {
                if (visited.indexOf(element) === -1 && queue.indexOf(element) === -1) {
                    parent[vertices.indexOf(element)] = currentVertex;
                    queue.push(element);
                }
            });
        }
        if (queue.length === 0 && vertexCopy.length !== 0) {
            queue.push(vertexCopy[vertexCopy.length - 1]);
        }
    }
    resetButton.disabled = false;
    traversalComplete.style.opacity = 1;
}

async function dfs() {
    algo.style.opacity = 1;
    order.style.opacity = 1;
    algo.innerText = 'Depth First Search';
    order.innerText = 'Order:';
    bfsButton.disabled = true;
    dfsButton.disabled = true;
    vNo = document.getElementById("start-vertex").value;
    if (vNo > vertices.length) {
        alert("Invalid Input");
        return;
    }
    // removeAllEdges();
    let vertexCopy = [...vertices];
    let visited = [];
    let parent = Array(vertices.length).fill(null);
    let start = vertices[vNo];
    let stack = [start];
    while (stack.length > 0) {
        console.log(stack);
        let currentVertex = stack.pop();
        console.log(currentVertex);
        let rIndex = vertexCopy.indexOf(currentVertex);
        vertexCopy.splice(rIndex, 1);
        await sleep(500);
        let currentParent = parent[vertices.indexOf(currentVertex)];
        if (currentParent !== null) {
            createEdge(document.getElementById(currentVertex), document.getElementById(currentParent), true);
        }
        await sleep(1000);
        document.getElementById(currentVertex).style.backgroundColor = 'green';
        visited.push(currentVertex);
        order.innerText += ` ${vertices.indexOf(currentVertex)}`;
        let neighbours = edges.get(currentVertex);
        if (neighbours !== undefined) {
            neighbours.forEach(async element => {
                if (visited.indexOf(element) === -1) {
                    let sIndex = stack.indexOf(element);
                    if (sIndex !== -1) {
                        stack.splice(sIndex, 1);
                    }
                    parent[vertices.indexOf(element)] = currentVertex;
                    stack.push(element);
                }
                await sleep(1000);
            });
        }
        if (stack.length === 0 && vertexCopy.length !== 0) {
            stack.push(vertexCopy[vertexCopy.length - 1]);
        }
    }
    resetButton.disabled = false;
    traversalComplete.style.opacity = 1;
}

function removeAllEdges() {
    let rawEdges = document.getElementsByClassName('edge');
    while (rawEdges.length > 0) {
        let parent = rawEdges[0].parentElement;
        parent.removeChild(rawEdges[0]);
    }
}

function addAllEdges() {
    let drawn = [];
    for (element of edges) {
        drawn.push(element[0]);
        element[1].forEach((adjacent) => {
            if (drawn.indexOf(adjacent) === -1)
                createEdge(document.getElementById(element[0]), document.getElementById(adjacent), false);
        });
    }
}

function reset() {
    algo.innerText = '';
    order.innerText = '';
    resetButton.disabled = true;
    let visitEdges = document.getElementsByClassName('visit');
    while (visitEdges.length != 0) {
        let parent = visitEdges[0].parentElement;
        parent.removeChild(visitEdges[0]);
    }

    let circles = document.getElementsByClassName("vertex")
    for (let i = 0; i < circles.length; ++i) {
        circles[i].style.backgroundColor = '#aaa';
    }
    // addAllEdges();
    algo.style.opacity = 1;
    order.style.opacity = 1;
    traversalComplete.style.opacity = 0;
    done();
}