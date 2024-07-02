async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const initialBalance = 100; // Set initial balance
  const initialAddress = "08d5j857bd63gvbbwudnj9ni9203gjf347"; // Set initial network address

  const Assessment = await ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy(initialBalance, initialAddress);

  await assessment.deployed();

  console.log("Assessment deployed to:", assessment.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
