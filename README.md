# Drum patterns

A collection of drum patterns.
Imported from various sources:

- https://github.com/lvm/tidal-drum-patterns

- https://github.com/GiantSteps/drum-pattern-datasets

- https://github.com/montoyamoraga/drum-machine-patterns


# Pattern syntax

    [0-9A-Z]{2} [-x]+

# Example

    38 --x-
    36 x---

# Pattern semantics

First column:
* If it's a number it's a MIDI note, following the MIDI mapping of a Roland drum machine (like https://github.com/montoyamoraga/drum-machine-patterns#conventions-for-this-project)
* Otherwise:
  * `AC`: accent
  * `SH`: slide

Second column:
* `x`: a hit
* `-`: a rest

