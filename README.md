# :sunny: :sunny: Fort Collins Solar Scorecard :sunny: :sunny:

Solar Scorecard project: track Fort Collins renewable/solar energy goals.

## Goal of Project
The goal of this project is to create an up-to-date web-based data visualization tool for tracking solar contributions with respect to [City of Fort Collins 2015 Climate Action Plan](http://www.fcgov.com/environmentalservices/pdf/cap-framework-2015.pdf), whose goal is to:
> reduce emissions 20% below 2005 levels by 2020, 80% below 2005 levels by 2030, and achieve carbon neutrality by 2050.

## Methodology
Since the Climate Action Plan goal is in terms of aggregate 2005 greenhouse gases (ghg), for our purposes we will focus only on the emissions due to electrical.  Based on [Fort Collins 2015 Community Carbon Inventory](https://www.fcgov.com/climateaction/pdf/2015-community-carbon-inventory.pdf?1494967837), we will assume that 50% of emissions are due to electrical activity.

### Define CO2 Reference Points
In 2005, ghg emissions due to CO2 was 2.3 Million Metric Tons (mmt).  Therefore, we will assume the electrical-only emissions in 2005 were **1,150,000 mt**. Therefore, the 2020 electrical-only goal is **920,000 mt (230,000 mt reduction)**, and the 2030 electrical-only goal is **230,000 mt (920,000 mt reduction)**.

### Convert Solar Capacity to CO2 Reduction
Based on the [EPA's Greenhouse Gases Equivalencies Calculator](https://www.epa.gov/energy/greenhouse-gases-equivalencies-calculator-calculations-and-references), we will assume that every kilowatt hour (kWh) of solar energy produced will reduce emissions by **.000703 mt**.

Using these numbers we can express the 2020, 2030, and 2050 goals in terms of the kilowatt reductions needed to meet each goal.

```
2020: 20% Reduction
230,000 mt / (.000703 mt / 1 kWh * 8760 hr) =  37,348 kW

2030: 80% Reduction
920,000 mt / (.000703 mt / 1 kWh * 8760 hr) = 149,392 kW

2050: 100% Reduction (carbon neutrality)
1,150,000 mt / (.000703 mt / 1 kWh * 8760 hr) = 186,740 kW
```

Using the [PVWatts Calculator](http://pvwatts.nrel.gov/pvwatts.php) we can calculate Fort Collins' photovoltaic system output in kWh per year.  Assuming the variables in the table below, Fort Collins' system output is **6,111 kWh/year**.  Since there are 8760 hours in a year, Fort Collins' power output is **0.6976 kW**.

| Variable | Value |
| -------- | ----- |
| DC System Size (kW) | 4 |
| Module Type | Standard |
| Array Type | Fixed (open rack) |
| System Losses (%) | 14 |
| Tilt(deg) | 20 |
| Azimuth(deg) | 180 |

## Detailed Project Requirements
1. Create interactive, web-based, graphical depiction (chart) for each of the three emissions benchmarks mentioned above.
1. Incorporate solar power's contribution toward these goals by using publicly available photovoltaic (PV) permit data, specifically permits which have been issued to applicants requesting construction of PV facilities. Each permit contains basic PV data regarding size and quantity, which may be used as a rough estimate of how much solar energy the solar structure will provide. See [comment](https://github.com/CodeForFoco/solar-scorecard/issues/1#issuecomment-300964480) for details on viewing this data.
1. Make the tool as portable as possible so that it may be used for similar projects in other communities.

## Getting Started
1. Follow **Contributing** guidelines below.
1. Join our [#solar-scorecard Slack channel](https://codeforfoco.slack.com/messages/C5CHBBN4V)
1. Check out the [3D Version 4 API](https://github.com/d3/d3/blob/master/API.md#scales-d3-scale) and [3D Tutorial](https://github.com/d3/d3/wiki/Tutorials) to get started with D3.

## Contributing
We welcome new contributors. Be sure to check out guide on [contributing][contributing], which includes instructions on how to fork, clone, branch, commit, pull request and sync your fork.

Not sure where to start? Look for [open issues][githubissue] on GitHub, or message the team on [our Slack site][slack]. If you aren't on our Slack, [click here for an invite][slackinvite].

TL;DR Contribution Workflow:

1. [Fork][fork] this repository and Clone your fork locally.
1. This project has a handful of `NodeJS` dependencies, so if you do not already have it then install the [latest stable version][node].
1. Run `npm install` in your project folder.
1. If you want files to automatically compile and reload your browser, run `npm start`.
1. Checkout a new branch on which to make your changes.
1. Make edits. Try to match existing coding style.
1. Test your changes.
1. Commit your changes. Push your changes to your fork on GitHub.
1. Submit a new [pull request][pullrequest] and your changes will be reviewed and merged.

## Repository Organization
This repo is structured as follows:

``` text
├── LICENSE
├── README.md
├── code
    ├── js                            Front end javascript code
    ├── css                           Front end styles
    └── scss                          Compiles to CSS
└── data
    ├── data-sources                  Utilities around obtaining data
    ├── schema                        Data models
    └── scripts                       Helper scripts
```

## Bugs / Feedback / Suggestions
We encourage you to [open up an issue][newissue] if you have any feedback, suggestions or bugs.

## License
MIT, see [LICENSE](/LICENSE) for full license.

[slack]: https://codeforfoco.slack.com/
[slackinvite]: https://codeforfocoslack.herokuapp.com
[fork]: https://help.github.com/articles/fork-a-repo/
[forkthisrepo]: https://github.com/CodeForFoco/solar-scorecard#fork-destination-box
[contributing]: https://github.com/CodeForFoco/org/blob/master/CONTRIBUTING.md
[githubissue]: https://github.com/CodeForFoco/solar-scorecard/issues
[newissue]: https://github.com/CodeForFoco/solar-scorecard/issues/new
[pullrequest]: https://github.com/CodeForFoco/solar-scorecard/pulls
[node]: https://nodejs.org/en/