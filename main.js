const projects = [
    {
        "name": "PyroShot",
        "url": "https://github.com/Christian-Klempau/PyroShot",
        "description": "Native Linux (X11, Wayland) screenshot annotation tool built in Flutter",
        "tech": ["Flutter", "Dart", "Linux"],
        "image": "./images/PyroShot.png"
    },
    {
        "name": "TechGraphVis",
        "url": "https://github.com/Christian-Klempau/d3-project-example",
        "description": "World's most used tech echosystem: d3.js graph visualization",
        "tech": ["d3js", "JS", "HTML", "CSS"],
        "image": "./images/TechGraphVis.png"
    },
    {
        "name": "OpenVerbum",
        "url": "https://github.com/Christian-Klempau/OpenVerbum",
        "description": "Free, multiplatform transcription GUI, based on OpenAI's Whisper",
        "tech": ["Python", "AI", "Qt"],
        "image": "./images/OpenVerbum.png"
    },
    {
        "name": "ExcalidrawPro",
        "url": "https://github.com/Christian-Klempau/excalidraw-extension",
        "description": "Free alternative to Excalidraw+, built as a Chrome extension",
        "tech": ["Chrome", "JS", "HTML", "CSS"],
        "image": "./images/ExcalidrawPro.png"
    },
    {
        "name": "Game of Life",
        "url": "https://github.com/Christian-Klempau/RustGameOfLife",
        "description": "Rust implementation of Conway's Game of Life, compiled to WASM",
        "tech": ["Rust", "WASM"],
        "image": "./images/RustGameOfLife.png"

    },
    {
        "name": "MaxSAT Fuzz Debug",
        "url": "https://github.com/Christian-Klempau/fuzzer-delta-debugger.git",
        "description": "WCNF MaxSAT automatic Fuzzer and Delta Debugger, for any solver",
        "tech": ["C", "SAT", "Linux"],
        "image": "./images/DeltaDebugger.png"
    },

    {
        "name": "Kanban Fullstack",
        "url": "https://github.com/Christian-Klempau/forms-back",
        "description": "Django backend + React TS fullstack Kanban board [WIP]",
        "tech": ["Python", "Django", "Ionic", "React", "TS"],
        "image": "./images/Kanban.png"
    },
    {
        "name": "Prime Generator",
        "url": "https://github.com/Christian-Klempau/prime-generator",
        "description": "Solovay-Strassen primality test implementation in pure C",
        "tech": ["C", "Math"],
        "image": "./images/PrimeGenerator.png"
    },
    {
        "name": "Repos Downloader",
        "url": "https://github.com/Christian-Klempau/repos_downloader",
        "description": "A utility to download all subfolders from a GitHub repo, given a CSV",
        "tech": ["Git", "Python"],
    },
    {
        "name": "Rust TodoList API",
        "url": "https://github.com/Christian-Klempau/rust_actix_psql_api",
        "description": "An HTTP Rust, Actix, Serde, Postgres API for a simple TodoList",
        "tech": ["Rust", "Postgres", "API"],
    },
    {
        "name": "Flask Mongo API",
        "url": "https://github.com/Christian-Klempau/FlaskMongoAPI",
        "description": "A Simple Python Flask API for a MongoDB database",
        "tech": ["Flask", "Python", "MongoDB", "API"],
    }
]

const WIDTH = 1920;
const HEIGHT = 2000;
const svg = d3.select("#vis").attr("width", WIDTH).attr("height", HEIGHT);


const MARGIN = {
    top: 30,
    bottom: 100,
    right: 0,
    left: 40,
};

const TECH_COLORS = {
    "Flutter": "#02569B",
    "Dart": "#00B4AB",
    "Linux": "#000000",
    "d3js": "#F9A03F",
    "JS": "#F9A03F",
    "HTML": "#F16529",
    "CSS": "#264DE4",
    "Python": "#3776AB",
    "Django": "#092E20",
    "AI": "#3776AB",
    "Qt": "#41CD52",
    "Chrome": "#4285F4",
    "Rust": "#f66b00",
    "WASM": "#624de8",
    "C": "#A8B9CC",
    "SAT": "#A8B9CC",
    "Ionic": "#3880FF",
    "React": "#61DBFB",
    "TS": "#007ACC",
    "Git": "#F05032",
    "MongoDB": "#47A248",
    "Flask": "#000000",
    "API": "#000000",
    "Math": "#000000",
    "Postgres": "#336791",

}

const TECH_ICONS = {
    "Flutter": "./images/tech_icons/flutter.png",
    "Dart": "./images/tech_icons/dart.png",
    "Linux": "./images/tech_icons/linux.png",
    "d3js": "./images/tech_icons/d3js.png",
    "JS": "./images/tech_icons/js.png",
    "HTML": "./images/tech_icons/html.png",
    "CSS": "./images/tech_icons/css.png",
    "Python": "./images/tech_icons/python.png",
    "Django": "./images/tech_icons/django.png",
    "AI": "./images/tech_icons/ai.png",
    "Qt": "./images/tech_icons/qt.png",
    "Chrome": "./images/tech_icons/chrome.png",
    "Rust": "./images/tech_icons/rust.png",
    "WASM": "./images/tech_icons/wasm.png",
    "C": "./images/tech_icons/c.png",
    "SAT": "./images/tech_icons/sat.png",
    "Ionic": "./images/tech_icons/ionic.png",
    "React": "./images/tech_icons/react.png",
    "TS": "./images/tech_icons/ts.png",
    "Git": "./images/tech_icons/git.png",
    "MongoDB": "./images/tech_icons/mongodb.png",
    "Flask": "./images/tech_icons/Flask.png",
    "API": "./images/tech_icons/api.png",
    "Math": "./images/tech_icons/math.png",
    "Postgres": "./images/tech_icons/postgres.png",
}

const HEIGHTVIS = HEIGHT - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = WIDTH - MARGIN.right - MARGIN.left;

const container = svg
    .append("g")
    .attr("transform", `translate(${MARGIN.left} ${MARGIN.top})`);

function filter(text) {
    const input = text.toLowerCase();
    const filtered = projects.filter((d) => {
        return d.name.toLowerCase().includes(input) || d.description.toLowerCase().includes(input);
    });
    joinProjects(filtered);
}

d3.select("#search").on("input", function () {
    filter(this.value);
});

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
            }
        }
    });
}

function joinProjects(data) {
    const squareWidth = 500;
    const squareHeight = 400;
    const nPerRow = 3;


    container
        .selectAll("rect")
        .data(data)
        .join((enter) => {
            let rect = enter
                .append("rect")
                .attr("id", (d, i) => "rect-" + d.name)
                .attr("x", (d, i) => (i % nPerRow) * (WIDTHVIS / nPerRow))
                .attr("y", (d, i) => (Math.floor(i / nPerRow)) * (squareWidth))
                .attr("width", squareWidth)
                .attr("height", squareHeight)
                .attr("fill", (d) => "#2d0530")
                .attr("stroke", "#f2c68f")
                .attr("stroke-width", 3)
                .select("text")
                .data(data)
                .join("text")
                .attr("id", (d, i) => "text-name-" + d.name)
                .attr("x", (d, i) => (i % nPerRow) * (WIDTHVIS / nPerRow) + squareWidth / 2)
                .attr("y", (d, i) => (Math.floor(i / nPerRow)) * (squareWidth) + 35)
                .attr("width", squareWidth)
                .attr("height", squareHeight)
                .text((d) => d.name)
                .attr("fill", "white")
                .attr("font-size", 30)
                .attr("text-anchor", "middle")
                .select("text")
                .data(data)
                .join("text")
                .attr("id", (d, i) => "text-description-" + d.name)
                .attr("x", (d, i) => (i % nPerRow) * (WIDTHVIS / nPerRow) + squareWidth / 2)
                .attr("y", (d, i) => (Math.floor(i / nPerRow)) * (squareWidth) + 70)
                .attr("width", squareWidth)
                .attr("height", squareHeight)
                .text((d) => d.description)
                .attr("fill", "white")
                .attr("font-size", 20)
                .attr("text-anchor", "middle")
                .call(wrap, squareWidth)
                .select("image")
                .data(data)
                .join("image")
                .attr("id", (d, i) => "image-" + d.name)
                .attr("x", (d, i) => (i % nPerRow) * (WIDTHVIS / nPerRow))
                .attr("y", (d, i) => (Math.floor(i / nPerRow)) * (squareWidth) + 55)
                .attr("width", squareWidth)
                .attr("height", squareHeight)
                .attr("xlink:href", (d) => d.image ? d.image : "./images/placeholder.png")
                .attr("text-anchor", "middle")
                .style("cursor", "pointer")
                .on("click", (_, d) => {
                    window.open(d.url, "_blank");
                })
                // give each data entry a group, where it has a react + text for every data.tech
                .select("g")
                .data(data)
                .join("g")
                .attr("id", (d, i) => "g-tech" + d.name)
                .selectAll("rect")
                .data((d, i) =>
                    d.tech.map((tech) => {
                        return {
                            tech: tech,
                            index: i,
                            name: d.name
                        }
                    })
                )
                .join("rect")
                .attr("id", (d, i) => d.name + "-tech-" + d.tech + "-" + d.index + "-" + i)
                .attr("x", (d, i) => (d.index % nPerRow) * (WIDTHVIS / nPerRow) + i * 50)
                .attr("y", (d, i) => (Math.floor(d.index / nPerRow) + 1) * (squareWidth) - 80)
                .attr("width", 40)
                .attr("height", 40)
                .attr("stroke", "black")
                .attr("fill", (d, i) => "white")
                .select("text")
                .data((d, i) =>
                    d.tech.map((tech) => {
                        return {
                            tech: tech,
                            index: i,
                            name: d.name
                        }
                    })
                )
                .join("image")
                .attr("id", (d, i) => d.name + "-tech-" + d.tech + "-" + d.index + "-" + i)
                .attr("x", (d, i) => (d.index % nPerRow) * (WIDTHVIS / nPerRow) + i * 50)
                .attr("y", (d, i) => (Math.floor(d.index / nPerRow) + 1) * (squareWidth) - 80)
                .attr("width", 40)
                .attr("height", 40)
                .attr("xlink:href", (d) => TECH_ICONS[d.tech])
                .attr("text-anchor", "middle")
                .style("cursor", "pointer")
                .on("click", (_, d) => {
                    window.open("https://www.google.com/search?q=" + d.tech, "_blank");
                })
                // tooltip
                .on("mouseover", (e, d, i) => {
                    d3.select("#tooltip")
                        .style("position", "absolute")
                        .style("opacity", 1)
                        .style("background-color", TECH_COLORS[d.tech])
                        .style("left", e.pageX + "px")
                        .style("top", (e.pageY) + "px")
                        .style("padding", "10px")
                        .style("color", "white")
                        .style("font-size", "20px")
                        .style("font-weight", "bold")
                        .style("border", "2px solid black")
                        .html(d.tech);
                })
                .on("mouseout", (e, d, i) => {
                    d3.select("#tooltip").style("opacity", 0);
                });
            return rect;
        },
        )

}


joinProjects(projects);