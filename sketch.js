var cols=40;
var rows=40;
var grid=new Array(cols);

var openSet=[];
var closedSet=[];
var path=[];

var end;
var w,h;
var noSolution=false;

function spot(x,y){
    this.i=x;
    this.j=y;
    this.f=0;
    this.g=0;
    this.h=0;
    this.neighbors=[];
    this.previous=undefined;
    this.wall=false; 

    if(random(1)<0.3){
        this.wall=true;
    }
    this.show=(color)=>{
        fill(color);
        if(this.wall){
            fill(0);
        }
        noStroke();
        rect(this.i*w,this.j*h,w-1,h-1);
        
    }

    this.addneighbors=function(grid){
        let i=this.i;
        let j=this.j;

        if(i<cols-1){
            this.neighbors.push(grid[i+1][j]);
        }
        if(i>0){
            this.neighbors.push(grid[i-1][j]);
        }
        if(j<rows-1){
            this.neighbors.push(grid[i][j+1]);
        }
        if(j>0){
            this.neighbors.push(grid[i][j-1]);
        }
    }
}

function removeArrayElement(mySet,element){
    for(let i=0;i<mySet.length;++i){
        if(mySet[i]==element){
            mySet.splice(i,1);
        }
    }
}
function setup() {
    createCanvas(400, 400);

    w=width/cols;
    h=height/rows;

    
    for(let i=0;i<cols;++i){
        grid[i]=new Array(rows);
    }

    for(var i=0;i<rows;++i){
        for(var j=0;j<cols;++j){
            grid[i][j]=new spot(i,j);
        }
    }

    for(var i=0;i<rows;++i){
        for(var j=0;j<cols;++j){
            grid[i][j].addneighbors(grid);
        }
    }
    var start=grid[0][0];
    end=grid[rows-1][cols-1];
    start.wall=false;
    end.wall=false;

    openSet.push(start); 
}

var heuristic=(a,b)=>{
    var d=abs(a.i-b.i)+abs(a.j-b.j);
    return d;
}

function draw() {
    if(openSet.length>0){
        var minScore=0;
        for(var i=0;i<openSet.length;++i){
            if(openSet[i].f<openSet[minScore].f){
                minScore=i;
            }
        }

        var current=openSet[minScore];
        if(openSet[minScore]==end){
            console.log('Done!');
            noLoop();
            
        }
        closedSet.push(current);
        removeArrayElement(openSet,current);
        
        var neighbors=current.neighbors;

        for(var i=0;i<neighbors.length;++i){
            var neighbor=neighbors[i];
            if(!closedSet.includes(neighbor)&&!neighbor.wall){
                var tentG=current.g+1;

                if(openSet.includes(neighbor)){
                    if(tentG<neighbor.g){
                        neighbor.g=tentG;
                    }
                }
                else{
                    neighbor.g=tentG;
                    openSet.push(neighbor);
                }

                neighbor.h=heuristic(neighbor,end);
                neighbor.f=neighbor.g+neighbor.h;
                neighbor.previous=current;
            }
        }
    }
    else{
        console.log('No solution');
        noSolution=true;
        noLoop();
    }
    background(0);

    if(!noSolution){
        path=[];
        var temp=current;
        path.push(temp);
        while(temp.previous){
            path.push(temp.previous);
            temp=temp.previous;
        }    
    }

    for(var i=0;i<rows;++i){
        for(var j=0;j<cols;++j){
            grid[i][j].show(color(255));
        }
    }

    for(var i=0;i<openSet.length;++i){
        openSet[i].show(color(0,255,0))
    }

    for(var i=0;i<closedSet.length;++i){
        closedSet[i].show(color(255,0,0))        
    }

    for(var i=0;i<path.length;++i){
        path[i].show(color(0,0,255));
    }
}