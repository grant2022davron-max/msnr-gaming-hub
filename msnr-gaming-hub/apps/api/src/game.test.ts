import test from "node:test"; import assert from "node:assert/strict"; import {applyTap,regenerateEnergy,type TapState} from "./game"; import {GAME_CONFIG} from "./config";
const base:TapState={points:10,energy:10,energyCapacity:100,lastEnergyAtMs:1700000000000,dailyTapCount:0,dailyTapDate:null,totalTaps:10};
test("valid tap awards one point and consumes energy",()=>{const r=applyTap(base,base.lastEnergyAtMs+1000,1);assert.equal(r.points,11);assert.equal(r.energy,9);assert.equal(r.totalTaps,11)});
test("energy regenerates every three seconds",()=>assert.equal(regenerateEnergy(base,base.lastEnergyAtMs+6000).energy,12));
test("energy is capped",()=>assert.equal(regenerateEnergy({...base,energy:100},base.lastEnergyAtMs+60000).energy,100));
test("bulk taps rejected",()=>assert.throws(()=>applyTap(base,base.lastEnergyAtMs+1000,10),/exactly one tap/));
test("daily limit enforced",()=>{const today=new Date(base.lastEnergyAtMs+1000).toISOString().slice(0,10);assert.throws(()=>applyTap({...base,dailyTapDate:today,dailyTapCount:GAME_CONFIG.dailyTapLimit},base.lastEnergyAtMs+1000,1),/Daily tap limit/)});
