# Blockchain File Structure

```
contracts/
├── contracts/
│   ├── IPRegistry.sol               # Course IP registration contract
│   ├── CourseDirectory.sol          # Read-only course listing (optional)
│   ├── CertificateNFT.sol           # Learner certificates (optional)
│   └── interfaces/
│       └── IIPRegistry.sol          # Contract interface
│
├── scripts/
│   ├── deploy.js                    # Main deployment script
│   ├── registerCourse.js            # Example: register a course
│   ├── getCourses.js                # Example: query courses
│   └── utils.js                     # Helper functions
│
├── test/
│   ├── IPRegistry.test.js
│   ├── CourseDirectory.test.js
│   └── CertificateNFT.test.js
│
├── artifacts/
│   ├── IPRegistry.json              # Compiled ABI & bytecode
│   ├── CourseDirectory.json
│   └── CertificateNFT.json
│
├── .env                             # Private key, RPC URL (git-ignored)
├── .env.example
├── hardhat.config.js                # Hardhat configuration
├── package.json
├── tsconfig.json
├── contracts.json                   # Deployed contract addresses & ABIs
├── README.md
└── .gitignore
```

## Key Folders Explained

- **`contracts/`** — Solidity source files (.sol)
  - `IPRegistry.sol` — Main course registration contract
  - `CourseDirectory.sol` — Optional listing contract
  - `CertificateNFT.sol` — Optional certificate minting
- **`scripts/`** — Hardhat/Node.js scripts
  - Deploy, register, query functions
- **`test/`** — Hardhat tests (Mocha/Chai)
- **`artifacts/`** — Compiled contract ABIs (auto-generated)

## Key Files

- **`hardhat.config.js`** — Network config, compiler settings
- **`contracts.json`** — Deployed addresses for backend/frontend
- **`.env`** — Private key & RPC endpoint
