
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
    // warning this clears the grid
    resize: function(width, height){
        this.clear();
        this.grid = [];
        const n = width * height;
        for(let i = 0; i < n; ++i){
            this.grid.push({val: -1, name: '&nbsp;', index: i})
        }        
        this.width = width;
        this.height = height;
        this.total = n;
        this.rerender();
    },
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
    getDistance: function(x1 = 0, y1 = 0, x2 = 0, y2 = 0){
        return {
            x: x1 - x2,
            y: y1 - y2
        };
    },
    getMaxDistance: function(formula){
        if(!formula || formula.length < 1){
            console.log("GRID: failed to load formula: too short or null");
            return;
        }        
        const maxDist = {x: 0, y: 0}
        for(let i = 0; i < formula.length; ++i){
            const a = formula[i];
            const current = {x:0,  y: 0}
            for(let j = 0; j < formula.length; ++j){
                const b = formula[j];
                if(a == b) continue;
                current.x += b.dist.x 
                current.y += b.dist.y

                if(maxDist.x < current.x){
                    maxDist.x = current.x;
                }
                if(maxDist.y < current.y){
                    maxDist.y = current.y;
                }
            }
        }
        // first block
        ++maxDist.x;
        ++maxDist.y;
        return maxDist;
    },
    checkDistances(dist1, dist2){
        return dist1 && dist2 && dist1.x == dist2.x && dist1.y == dist2.y;
    },
    /* 
        My approach for recipes would be to get the distance between
        each component
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
        let order = 0;
        for(let i = 0; i < occupiedSlot.length; ++i){
            ++order;
            const slot = occupiedSlot[i];
            sCoors = this.getCoorsFromIndex(slot.index);
            if(formula.length == 0){
                formula.push(Object.assign({}, { dist: this.getDistance(), ...slot, ...sCoors, order }));
                continue;
            }
            const lastSlot = occupiedSlot[i-1];
            lsCoors = this.getCoorsFromIndex(lastSlot.index);
            formula.push(Object.assign({}, { dist: this.getDistance(sCoors.x, sCoors.y, lsCoors.x, lsCoors.y), ...slot, ...sCoors, order }));
        }
        return {
            formula,
            total: occupiedSlot.length
        }
    },
    // so, to check wether the formula is valid we'll do a simple heuristic
    // of comparing each slot's val and dist
    checkFormula: function(formula, currentFormula = this.getCurrentFormula().formula){
        if(currentFormula.length != formula.length){
            return false;
        }
        for(let i = 0; i < currentFormula.length; ++i){
            const cf = currentFormula[i];
            const f = formula[i];
            if(!this.checkDistances(cf.dist, f.dist) || cf.val != f.val){
                return false;
            }
        }
        return true;
    },
    // moves all entities in the grid by the amount specified in coordinates x,y
    loadFormula: function(formula){
        this.clean();
        if(!formula || formula.length < 1){
            console.log("GRID: failed to load formula: too short or null");
            return;
        }
        const maxDist = this.getMaxDistance(formula);
        console.log(maxDist)
        if(this.width < maxDist.x || this.height < maxDist.y){
            this.resize(maxDist.x, maxDist.y);
        }
        let bias = { 
            x: 0, y: 0
        }
        let start = {
            x: 0, y: 0
        }
        for(let i = 1; i < formula.length; ++i){
            start.x += formula[i].dist.x
            start.y += formula[i].dist.y
            if(start.x < 0){
                bias.x += Math.abs(start.x)
            }
            if(start.x >= this.width){
                bias.x -= start.x
            }
            if(start.y < 0){
                bias.y += Math.abs(start.y)
            }
            if(start.y >= this.height){
                bias.y -= start.y
            }            
        }     
        start = {x: bias.x, y: bias.y}
        for(let i = 0; i < formula.length; ++i){
            let form = formula[i];
            start.x += form.dist.x;
            start.y += form.dist.y;
            let index = this.getIndexFromCoors(start.x, start.y);
            this.grid[index].name = form.name;
            this.grid[index].val = form.val;
        }
        this.rerender();
    },
    render: function(){  
        const me = this;
        if(!me.container){
            console.log("GRID: failed to render: there's no container attached.");
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
            console.log("GRID: failed to rerender: there's no container attached.");
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
        console.log('GRID: stopped grid ID: '+this.id+'.');
    }
   }
   return obj;
};