import { GAME_CONFIG } from "./config";
export type TapState = { points:number; energy:number; energyCapacity:number; lastEnergyAtMs:number; dailyTapCount:number; dailyTapDate:string|null; totalTaps:number };
export function regenerateEnergy(state:TapState,nowMs:number):TapState {
 const elapsed=Math.max(0,Math.floor((nowMs-state.lastEnergyAtMs)/1000)); const restored=Math.floor(elapsed/GAME_CONFIG.energyRestoreEverySeconds);
 const energy=Math.min(state.energyCapacity,state.energy+restored);
 const lastEnergyAtMs=energy===state.energyCapacity?nowMs:state.lastEnergyAtMs+restored*GAME_CONFIG.energyRestoreEverySeconds*1000;
 return {...state,energy,lastEnergyAtMs};
}
export function applyTap(input:TapState,nowMs:number,tapCount:number):TapState {
 if(tapCount!==1||tapCount>GAME_CONFIG.maxTapCountPerRequest) throw new Error("Each request must contain exactly one tap");
 const state=regenerateEnergy(input,nowMs); const today=new Date(nowMs).toISOString().slice(0,10); const count=state.dailyTapDate===today?state.dailyTapCount:0;
 if(count>=GAME_CONFIG.dailyTapLimit) throw new Error("Daily tap limit reached"); if(state.energy<1) throw new Error("Not enough energy");
 return {...state,points:state.points+GAME_CONFIG.pointsPerTap,energy:state.energy-1,dailyTapCount:count+1,dailyTapDate:today,totalTaps:state.totalTaps+1};
}
