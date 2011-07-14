Rabu Schedule Release Checklist
===============================

1. Update CHANGELOG, README, and example .rabu file
2. Commit
3. Update version number in README
4. Update version number in Java code's "usage.txt"
5. `rake release shutdown minify=true`
6. `java -jar rabu.jar < estimates.rabu > projection.html` in `generated/release` just to be sure. Double-check version number and output.
7. Commit with 'Release X.Y.Z' as commit message
8. `git tag "release-X.Y.Z"`
9. `git push`
10. `git push --tags`
11. Add '+dev' to version number in README and "usage.txt"
12. Commit with message 'Started next version'
13. Copy release file to website
14. Update example on website
15. Announce to mailing list

Mailing list announcement template
---

Subject: Rabu X.Y.Z changelog

Rabu X.Y.Z has been released. You can download it from http://www.teamrabu.com/rabu.zip .

Changes:
[Paste in changelog]