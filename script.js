function bubbleSort(arr) {
    const a = arr.slice();
    const arrLength = a.length;
    for (let i = 0; i<arrLength-1; i++){
        for (let j = 0; j<arrLength-1-i; j++){
            if (a[j] > a[j+1]){
                const tmp = a[j];
                a[j] = a[j+1];
                a[j+1] = tmp;
            }
        }
    }
    return a;
}

function mergeSort(arr){
    if (arr.length <= 1) return arr.slice();

    const mid = arr.length >> 1;
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right){
    const result = [];
    let i = 0;
    let j = 0;

    while (i<left.length && j<right.length){
        if (left[i]<=right[j]){
            result.push(left[i++]);
        }
        else{
            result.push(right[j++]);
        }
    }
    while (i<left.length){
        result.push(left[i++]);
    }
    while (j<right.length){
        result.push(right[j++]);
    }
    return result;
}

function quickSort(arr){
    if (arr.length <= 1){
        return arr.slice();
    }

    const a = arr.slice();
    const pivot = a[a.length >> 1];
    const left = [];
    const mid = [];
    const right = [];

    for (const x of a){
        if (x<pivot){
            left.push(x);
        }
        else if (x>pivot){
            right.push(x);
        }
        else{
            mid.push(x);
        }
    }

    return quickSort(left).concat(mid, quickSort(right));
}

function makeRandomArray(n){
    const arr = new Array(n);
    for (let i = 0; i<n; i++){
        arr[i] = Math.floor(Math.random()*1_000_000);
    }
    return arr;
}

function measureSort(sortFn, baseArr, repeat = 5){
    let sum = 0;
    for (let r = 0; r<repeat; r++){
        const arr = baseArr.slice();
        const timeStart = performance.now();
        const sorted = sortFn(arr);
        const timeEnd = performance.now();

        for (let i = 1; i<sorted.length; i++){
            if (sorted[i-1]>sorted[i]){
                console.error("정렬 실패 인덱스", i);
                break;
            }
        }
        sum += (timeEnd-timeStart);
    }
    return sum / repeat;
}

async function runExperiment(){
    const sizes = [1000, 4000, 7000, 10000, 13000];

    const bubbleTimes = [];
    const mergeTimes = [];
    const quickTimes = [];

    for (const n of sizes){
        console.log(`N = ${n} 테스트`);
        const baseArr = makeRandomArray(n);

        const bubbleTime = measureSort(bubbleSort, baseArr);
        const mergeTime = measureSort(mergeSort, baseArr);
        const quickTime = measureSort(quickSort, baseArr);

        bubbleTimes.push(bubbleTime);
        mergeTimes.push(mergeTime);
        quickTimes.push(quickTime);
        
        console.log(`N=${n}, bubble=${bubbleTime.toFixed(3)}ms, merge=${mergeTime.toFixed(3)}ms, quick=${quickTime.toFixed(3)}ms`);
    }

    const ctx = document.getElementById("sortChart").getContext("2d");

    new Chart(ctx,{
        type: "line",
        data: {
            labels: sizes,
            datasets: [
                {
                    label: "Bubble Sort",
                    data: bubbleTimes,
                    borderWidth: 2,
                },
                {
                    label: "Merge Sort",
                    data: mergeTimes,
                    borderWidth: 2,
                },
                {
                    label: "Quick Sort",
                    data: quickTimes,
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "정렬 알고리즘 별 실행 시간 (ms)",
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "배열 크기 N",
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "평균 실행 시간 (ms)"
                    }
                }
            }
        }
    })
}

runExperiment();