
// Avoid colliding ids (far from certain, but practical enough for testing)
randomSeedInit = 2048;
lastId = Math.round(Math.random() * randomSeedInit)

/*

    GRID
    By Italo Russo

*/

function buildGrid(width, height, pixel_size = 32, interact = true){
   const grid = [];
   const n = width * height;
   for(let i = 0; i < n; ++i){
       grid.push({val: -1, name: '&nbsp;', index: i})
   }
   const obj = {
    container: null,
    width: width,
    height: height,
    total: width * height,
    ps: pixel_size,
    fontSize: '1.0em',
    selector: {
        name: '',
        val: -1
    },
    grid: grid,
    interact,
    id: Math.round(Math.random() * randomSeedInit + (++lastId)),
    setSelector: function(name, id){
        this.selector = {
            name,
            val: id
        }
    },
    setFontSize: function(size){
        this.fontSize = size;
        this.rerender();
    },
    attach:  function(container){
        this.clean();
        this.container = container;
    },
    getCoorsFromIndex: function(index){
        return {
            x: index % this.width,
            y: Math.floor(index / this.width)
        }
    },
    getIndexFromCoors: function(x, y){
        return x + y * this.height;
    },
    // fast and accurate enough
    getDistance: function(x1, y1, x2, y2){
        return (x1-x2)*(x1-x2) + (y1-y2) * (y1-y2);
    },
    /* 
        My approach for recipes would be to get the distance between
        each slot using √ a2 + b2 but not squared (to avoid decimals)
    */
    getCurrentFormula: function(){
        const formula = [];
        const occupiedSlot = [];
        for(let i = 0; i < this.total; ++i){
            const slot = this.grid[i];      
            if(slot.val != -1){
                occupiedSlot.push(slot)
            }
        }
        for(let i = 0; i < occupiedSlot.length; ++i){
            const slot = occupiedSlot[i];
            sCoors = this.getCoorsFromIndex(slot.index);
            if(formula.length == 0){
                formula.push(Object.assign({}, { dist: 0, ...slot, ...sCoors }));
                continue;
            }
            const lastSlot = occupiedSlot[i-1];
            lsCoors = this.getCoorsFromIndex(lastSlot.index);
            formula.push(Object.assign({}, { dist: this.getDistance(sCoors.x, sCoors.y, lsCoors.x, lsCoors.y), ...slot, ...sCoors }));
        }
        return {
            formula,
            total: occupiedSlot.length
        }
    },
    // so, to check wether the formula is valid we'll do a simple heuristic
    // of comparing each slot's val and dist
    checkFormula: function(formula, currentFormula = this.getCurrentFormula()){
        if(currentFormula.total != formula.total){
            return false;
        }
        for(let i = 0; i < currentFormula.length; ++i){
            const cf = currentFormula[i];
            const f = formula[i];
            if(cf.dist != f.dist || cf.val != f.val){
                return false;
            }
        }
        return true;
    },
    render: function(){  
        const me = this;
        if(!me.container){
            console.log("GRID: failed to render: there's no container attached.")
            return;
        }              
        // create base
        const base = document.createElement("div");
        base.style.display = "inline-block";
        base.style.width = this.width * this.ps;
        base.style.height = this.height * this.ps;
        base.style.backgroundColor = "grey";
        // add slots
        for(let i = 0; i < this.total; ++i){
            const _slot = this.grid[i];
            const slot = document.createElement("div");
            slot.style.display = "inline-block";
            slot.style.width = this.ps;
            slot.style.height = this.ps;
            slot.style.backgroundColor = _slot.val == -1 ? "transparent" : "lightgrey";
            slot.style.lineHeight = this.ps+"px";
            slot.style.textAlign = "center";
            slot.style.outline = "1px solid black"
            slot.innerHTML = "<div style=\"display:inline-block; font-size:"+this.fontSize+";\">"+_slot.name+"</div>";
            slot.onclick = function(){
                if(!me.interact){
                    return
                }
                _slot.name = _slot.val != -1 ? '&nbsp;' : me.selector.name;
                _slot.val = _slot.val != -1 ? -1 : me.selector.val;
                me.rerender();
            }
            base.appendChild(slot);
        }
        this.container.appendChild(base);
    },
    rerender: function(){
        if(!this.container){
            console.log("GRID: failed to rerender: there's no container attached.")
            return;
        }
        this.clean();
        this.render();
    },
    clean: function(){
        let cont = this.container;
        if(!cont) return;
        while (cont.firstChild) {
            cont.removeChild(cont.firstChild);
        }
    },
    clear: function() {
        for(let i = 0; i < this.total; ++i){
            grid[i] = {val: -1, name: '&nbsp;', index: i};
        }
        this.clean();
        this.rerender();
    },
    init: function(){
        console.log('GRID: spawned grid ID: '+this.id+' | '+this.width+"x"+this.height+" | pixel size "+this.ps);
        this.clean();
        this.render();
    },
    stop: function(){
        this.clean();
        this.container = null;
        console.log('GRID: stopped grid ID: '+this.id+'.')
    }
   }
   return obj;
};