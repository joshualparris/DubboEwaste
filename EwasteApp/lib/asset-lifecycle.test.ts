import test from "node:test";
import assert from "node:assert/strict";
import { evaluateAssetLifecycle } from "./asset-lifecycle";

const baseAsset = {
  id: "11111111-1111-1111-1111-111111111111",
  asset_code: "DEW-A-TEST",
  category: "LAPTOP",
  manufacturer: "Lenovo",
  model: "ThinkPad T14",
  ownership_verified: true,
  data_bearing: true,
  data_state: "UNWIPED_RESTRICTED",
  status: "INTAKE",
};

const authority = [{ created_at: "2026-10-02T00:00:00Z" }];
const accepted = [{ decision: "ACCEPT", created_at: "2026-10-02T00:01:00Z" }];

test("data-bearing accepted asset waits at sanitisation", () => {
  const result = evaluateAssetLifecycle({ asset: baseAsset, authorityRecords: authority, triageAssessments: accepted });
  assert.equal(result.stages.find((x)=>x.key==="AUTHORITY")?.state, "complete");
  assert.equal(result.stages.find((x)=>x.key==="SANITISATION")?.state, "pending");
  assert.equal(result.stages.find((x)=>x.key==="DIAGNOSTICS")?.state, "blocked");
});

test("open quarantine blocks processing", () => {
  const result = evaluateAssetLifecycle({
    asset: baseAsset,
    authorityRecords: authority,
    triageAssessments: accepted,
    quarantines: [{ status: "OPEN", reason_type: "BATTERY", reason: "Swollen" }],
  });
  assert.equal(result.stages.find((x)=>x.key==="QUARANTINE")?.state, "blocked");
  assert.match(result.blockers.join(" "), /Swollen/);
});

test("non-data-bearing asset can proceed directly to diagnostics", () => {
  const asset = { ...baseAsset, data_bearing: false, data_state: "NON_DATA_BEARING" };
  const result = evaluateAssetLifecycle({ asset, authorityRecords: authority, triageAssessments: accepted });
  assert.equal(result.stages.find((x)=>x.key==="SANITISATION")?.state, "not_required");
  assert.equal(result.stages.find((x)=>x.key==="DIAGNOSTICS")?.state, "pending");
});

test("recycling is not complete merely because RECYCLE was selected", () => {
  const diagnostics = [
    "Boot / POST","Memory","Storage health","Battery","Display","Keyboard","Wi-Fi","Charging","Physical condition",
  ].map((test_type, i)=>({test_type,result:"PASS",created_at:`2026-10-02T00:${10+i}:00Z`}));
  const asset = { ...baseAsset, data_state: "VERIFIED_CLEARED", status: "READY_FOR_RECYCLING" };
  const result = evaluateAssetLifecycle({
    asset,
    authorityRecords: authority,
    triageAssessments: accepted,
    media: [{data_state:"VERIFIED_CLEARED"}],
    tests: diagnostics,
    grades: [{final_grade:"B",graded_at:"2026-10-02T01:00:00Z"}],
    dispositions: [{disposition_type:"RECYCLE",destination:"AMR Dubbo",decided_at:"2026-10-02T01:10:00Z"}],
  });
  assert.equal(result.stages.find((x)=>x.key==="FULFILMENT")?.state, "pending");
});

test("received downstream recycling closes fulfilment", () => {
  const diagnostics = [
    "Boot / POST","Memory","Storage health","Battery","Display","Keyboard","Wi-Fi","Charging","Physical condition",
  ].map((test_type, i)=>({test_type,result:"PASS",created_at:`2026-10-02T00:${10+i}:00Z`}));
  const asset = { ...baseAsset, data_state: "VERIFIED_CLEARED", status: "RECYCLED" };
  const result = evaluateAssetLifecycle({
    asset,
    authorityRecords: authority,
    triageAssessments: accepted,
    media: [{data_state:"VERIFIED_CLEARED"}],
    tests: diagnostics,
    grades: [{final_grade:"B",graded_at:"2026-10-02T01:00:00Z"}],
    dispositions: [{disposition_type:"RECYCLE",destination:"AMR Dubbo",decided_at:"2026-10-02T01:10:00Z"}],
    outbound: [{status:"RECEIVED"}],
  });
  assert.equal(result.stages.find((x)=>x.key==="FULFILMENT")?.state, "complete");
  assert.equal(result.stages.find((x)=>x.key==="CERTIFICATE")?.state, "pending");
});
