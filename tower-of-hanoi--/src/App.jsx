import { motion } from 'framer-motion';
import './fonts/Halo Dek.ttf'
import { useState } from 'react'
import './App.css'
import logo from '../public/logo.png'



function App() {
  const [diskCount, setDiskCount] = useState(4); // Default 4 disks
  const [pegs, setPegs] = useState([Array.from({ length: diskCount }, (_, i) => diskCount - i), [], []]);
  const [isAnimating, setIsAnimating] = useState(false); // Prevent interactions during animation

  // Function to make a move
  const moveDisk = (from, to) => {
    const newPegs = [...pegs];
    const disk = newPegs[from].pop();
    newPegs[to].push(disk);
    setPegs(newPegs);
  };





  // Add this handler function
  const handleDiskCountChange = (e) => {
    const count = parseInt(e.target.value);
    if (count > 0 && count <= 10) {
      setDiskCount(count);
      // Create new array of disks from count down to 1
      const newDisks = Array.from({ length: count }, (_, i) => count - i);
      setPegs([newDisks, [], []]);
    }
  };




  // Recursive Tower of Hanoi solver
  const solveHanoi = async (n, from, to) => {
    if (n === 1) {
      await new Promise((resolve) => setTimeout(resolve, 500 / speed));
      moveDisk(from, to);
      return;
    }
    
    // Find the auxiliary rod that's not the source or destination
    const auxRod = [0, 1, 2].find(rod => rod !== from && rod !== to);
    
    await solveHanoi(n - 1, from, auxRod, to);
    await new Promise((resolve) => setTimeout(resolve, 500 / speed));
    moveDisk(from, to);
    await solveHanoi(n - 1, auxRod, to, from);
  };

  const findSourceRod = () => {
    return pegs.findIndex(peg => peg.length > 0);
  };

    //start ang animation sa hanoi
    const startAnimation = async () => {
      if (isManualMode) {
        setIsManualMode(false);
      }
      
      setIsAnimating(true);
      const sourceRod = findSourceRod();
      
      if (sourceRod === -1) {
        setIsAnimating(false);
        return;
      }
    
      try {
        if (destinationRod === null) {
          const nextRod = (sourceRod + 1) % 3;
          await solveHanoi(pegs[sourceRod].length, sourceRod, nextRod, 
            [0, 1, 2].find(rod => rod !== sourceRod && rod !== nextRod));
        } else {
          await solveHanoi(pegs[sourceRod].length, sourceRod, destinationRod, 
            [0, 1, 2].find(rod => rod !== sourceRod && rod !== destinationRod));
        }
      } catch (error) {
        console.error('Animation error:', error);
      } finally {
        setDestinationRod(null);
        setIsAnimating(false);
      }
    };





  // function ni sya para colors (light to dark) sa disks
  // naka gradient napd
  const getGradient = (disk) => {
    const gradients = [
      "from-yellow-700 to-yellow-500", // Disk 1: Dark yellow to solid yellow
      "from-orange-700 to-orange-500", // Disk 2: Dark orange to solid orange
      "from-red-700 to-red-500",       // Disk 3: Dark red to solid red
      "from-indigo-700 to-indigo-500", // Disk 4: Dark indigo to solid indigo
      "from-purple-700 to-purple-500", // Disk 5: Dark purple to solid purple
      "from-yellow-800 to-yellow-600", // Disk 6: Darker yellow to solid yellow
      "from-orange-800 to-orange-600", // Disk 7: Darker orange to solid orange
      "from-red-800 to-red-600",       // Disk 8: Darker red to solid red
      "from-indigo-800 to-indigo-600", // Disk 9: Darker indigo to solid indigo
      "from-purple-800 to-purple-600", // Disk 10: Darker purple to solid purple
    ];
  




    // Ensure we don't go out of bounds
    const index = Math.min(disk - 1, gradients.length - 1);
    return gradients[index];
  };



  const [speed, setSpeed] = useState(1); // State para sa unsa sya ka kusog

  const handleSpeedChange = (newSpeed) => {     //function nya
    setSpeed(newSpeed);
  };

  const [destinationRod, setDestinationRod] = useState(2);// default rod destination
  
  const handleDestinationChange = (newDestination) => {
    if (destinationRod === newDestination) {
      setDestinationRod(null); // Deselect if the same rod is clicked
    } else {
      setDestinationRod(newDestination); // Select the new rod
    }
  };
  
  
  const [isManualMode, setIsManualMode] = useState(false);

  const moveAndShakeKeyframes = {
    initial: { x: 0, y: 0, scale: 1 },
    lift: { y: -50, scale: 1.1 },
    shake: {
      x: [0, -20, 20, -10, 10, 0],
      y: -50,
      scale: 1.1
    },
    land: {
      x: 0,
      y: 0,
      scale: [1.1, 0.9, 1.05, 0.95, 1],
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    
    <div className="flex flex-col bg-blue-200 min-h-screen relative overflow-hidden p-0 m-0" >
      {/* naa dre ang title etc. murag navigation bar */}
      <div className='flex justify-start items-center ml-2 mt-2'>
      {/* add a logo */}
        <h1 className='text-5xl flex z-10' style={{ fontFamily: 'Halo Dek, sans-serif' }}><img src={logo} alt="Logo" className="h-10 w-12 " />Tower of Hanoi</h1>
      </div>




    {/* ibutang ang 1x 2x 4x buttons, start animation, og  */}
    <div className='flex mb-16 ml-40 mr-40 justify-end'>

      {/* Cloud 1 */}
      <div className="absolute w-64 h-32 bg-white rounded-full opacity-70 top-10 left-0 animate-clouds"></div>
      {/* Cloud 2 */}
      <div className="absolute w-48 h-24 bg-white rounded-full opacity-70 top-40 left-20 animate-clouds"></div>
      {/* Cloud 3 */}
      <div className="absolute w-56 h-28 bg-white rounded-full opacity-70 top-20 left-60 animate-clouds"></div>


      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
        {/* Sun Core */}
      <div className="bg-yellow-400 w-32 h-32 rounded-full "></div>

        {/* siga2 sa sun */}
        <div className="absolute w-48 h-48">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={`absolute w-4 h-4 bg-yellow-200 rounded-full opacity-80 animate-flicker`}
                style={{

                  top: `calc(47% - 2px)`,
                  left: `calc(47% - 2px)`,
                  transform: `rotate(${i * 40}deg) translate(80px)`,
                }}
              ></div>
            ))}
        </div>
      </div>

      


      <div className='flex flex-col gap-7 z-10'>

      {/* buttons unsa ka paspas */}
      <div className='grid grid-cols-4 gap-1 items-center z-10'>
        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} type="button" onClick={() => handleSpeedChange(0.5)} className="text-white h-10 bg-[#babbbd] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-2xl text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 me-2">
          0.5x
        </motion.button>
        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} type="button" onClick={() => handleSpeedChange(1)} className="text-white h-10 bg-[#5d626e] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-2xl text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 me-2">
          1x
        </motion.button>
        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} type="button" onClick={() => handleSpeedChange(2)} className="text-white h-10 bg-[#72757c] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-2xl text-sm px-5 py-2.5 text-center flex items-center dark:focus:ring-[#2557D6]/50 me-2">
          2x
        </motion.button>
        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} type="button" onClick={() => handleSpeedChange(4)} className="text-white h-10 bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-2xl text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 me-2">
          4x
        </motion.button>
        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} type="button" onClick={() => handleSpeedChange(10)} className="text-white h-10 bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-2xl text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 me-2">
          10x
        </motion.button>
      </div>

        {/* input how many disks */}
        <div className='flex gap-3 z-10'>
          <div className='  flex justify-center items-center '>
          <input
              className="rounded-2xl  pt-2 pb-2 justify-items-center  focus:outline-none"
              placeholder="input how many disks (1-10)"
              name="disks"
              type="number"
              min="3"
              max="10"
              value={diskCount}
              onChange={handleDiskCountChange}
            />
          </div>

        {/* button start animation */}
          <div className='flex justify-center items-center'>
              <motion.button
                whileHover={{scale:1.1}} whileTap={{scale:0.9}}
                onClick={startAnimation}
                disabled={isAnimating}
                className={`px-4 py-2 rounded-2xl text-white  mt-2 mb-2 ${
                  isAnimating ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isAnimating ? "Animating..." : "Start"}
              </motion.button>
          </div>
          <div>
              <motion.button>

              </motion.button>
          </div>

        </div>
      </div>

    </div>



      {/* ang hanoi naa dre */}
      {/* ang pinaka una kay ang ma rods or whatever it is called */}
        <div className="flex justify-between ml-64 mr-64 flex-grow z-10">
          {pegs.map((peg, i) => (
            <motion.div
          key={i}
          className={`flex flex-col items-center cursor-pointer
            ${destinationRod === i ? 'border-white shadow-2 shadow-white/50 ring-4 ring-white/50 rounded-full' : ''}`}
          onClick={() => handleDestinationChange(i)}
            >
          <div className={`h-[100%] border-t-2 border-l-2 border-r-2 ${destinationRod === i ? 'border-white' : 'border-black'} w-8 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-2xl flex flex-col-reverse items-center hover:border-white`}>
            {peg.map((disk) => {
          const maxWidth = 540; // Maximum width for the disks
          const minWidth = 30; // Minimum width for the disks
          const diskWidth = minWidth + (disk * ((maxWidth - minWidth) / diskCount));

          return (
            // Update the motion.div animation
<motion.div
  key={disk}
  className={`h-16 border-2 border-black text-white flex items-center justify-center rounded-full bg-gradient-to-t ${getGradient(disk)}`}
  style={{
    width: `${diskWidth}px`,
    cursor: 'default'
  }}
  layout
  initial="initial"
  animate={[
    "lift",
    "shake",
    "land"
  ]}
  variants={moveAndShakeKeyframes}
  transition={{
    duration: 1.2,
    times: [0, 0.3, 0.7, 1],
    ease: [0.6, 0.05, -0.01, 0.99],
    type: "spring",
    stiffness: 500,
    damping: 30
  }}
/>
          );
            })}
            
          </div>
            </motion.div>
          ))}
        </div>


        {/* footer */}
      <div className=' bg-gradient-to-t from-green-700 to-green-500 h-6 line-h z-20'>
          {/* SAGBOT NIGG */}
          <div className="z-20 absolute bottom-0 left-0 w-full h-8 flex justify-between space-x-2">
            {Array.from({ length: 40 }).map((_, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-green-700 to-green-500 w-1 h-3 rounded-sm animate-sway"
                style={{
                  transform: `rotate(${Math.random() * 10 - 5}deg)`,
                  animationDelay: `${index * 0.1}s`, // Add staggered animation delay
                }}
              ></div>
            ))}
          </div>
      </div>


    </div>
  );
}

export default App
