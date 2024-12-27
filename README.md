# Drum patterns

A collection of drum patterns.
Imported from various sources:

- https://github.com/lvm/tidal-drum-patterns

- https://github.com/GiantSteps/drum-pattern-datasets

- https://github.com/montoyamoraga/drum-machine-patterns

- https://github.com/billautomata/tb03-tools

# Pattern syntax

    [0-9A-Z]{2} [-x]+

# Example

    38 --x-
    36 x---

# Pattern semantics

First column:
* If it's a number it's a MIDI note, following the MIDI mapping of a Roland drum machine (like https://github.com/montoyamoraga/drum-machine-patterns#conventions-for-this-project)
* Or the General Midi mapping otherwise
* Otherwise:
  * `AC`: accent
  * `SL`: slide

Second column:
* Drums: 
  * `x`: a hit
  * `-`: a rest

* Bass synthesizers: 
  * `0`, `1`, `2`: note state
  * `-`: no note

