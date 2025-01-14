let selections = []

document.addEventListener("mouseup", (e) => {
    let selection = document.getSelection();
    if (selection.isCollapsed) return;

    selections.push(selection);
    console.log(selections);
});

document.addEventListener("resize", (e) => {
    clearHighlights();
    ff();
});

let parentDiv = document.createElement("div");
parentDiv.id = "highlight-parent";

let currentDiv = document.getElementsByClassName("original-url")[0];

document.body.insertBefore(parentDiv, currentDiv);

const f = (selection) => {
    let rects = selection.getRangeAt(0).getClientRects();

    Object.values(rects).forEach((rect) => {
        let newDiv = document.createElement("div");
        newDiv.style.position = "fixed";
        newDiv.style.backgroundColor = "red";

        newDiv.style.left = `${rect.left}px`;
        newDiv.style.top = `${rect.top}px`;

        newDiv.style.height = `${rect.height}px`;
        newDiv.style.width = `${rect.width}px`;

        parentDiv.appendChild(newDiv);
    });
};

const ff = () => selections.forEach((s) => f(s));

const resetSelections = () => {
    selections = [];
};

const clearHighlights = () => {
    let parentDiv = document.getElementById("highlight-parent");
    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.lastChild);
    }
}
